import { API_URL } from '@/environment/Api';
import { HttpService } from "../HttpService.js";
import router from "@/router";
import { useSessionPropertyStore } from "@/store/SessionProperty";

const httpService = new HttpService();

export default {
  // Fetch JSON para presincronización
  async getReport(filters, URL_DATA) {
    const response = await fetch(`${API_URL}/report/${URL_DATA}`, {
      method: "POST",
      headers: httpService.getHeaders(),
      body: JSON.stringify(filters),
    });

    const data = await httpService.handleResponse(response);
    if (!data.success) throw new Error(data.message || "Error en el reporte");
    return data.data;
  },

  // Export PDF (descarga + vista en nueva pestaña)
  async exportReportPdf(filters, URL_DATA) {
    const response = await fetch(
      `${API_URL}/report/${URL_DATA}/export/pdf`,
      {
        method: "POST",
        headers: {
          ...httpService.getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        const sessionStore = useSessionPropertyStore();
        sessionStore.logout();
        router.replace({ name: "login" });
        throw new Error(
          "Sesión expirada. Por seguridad, debe ingresar de nuevo."
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    // Obtener blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // 1. Descargar el PDF
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.setAttribute(
      "download",
      `informe-presincronizacion-${new Date().toISOString().split("T")[0]}.pdf`
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    // 2. Abrir en nueva pestaña
    window.open(url, '_blank');

    // 3. Liberar URL después de un tiempo
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  },
};

