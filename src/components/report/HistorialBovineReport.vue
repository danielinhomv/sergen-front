<template>
    <LayoutApp>
        <div id="element-to-convert" class="max-w-7xl mx-auto px-6 py-6 lg:px-10 lg:py-8 h-full flex flex-col">

            <header class="sticky-header bg-white shadow-lg z-10 rounded-xl mb-6 border-b-4 border-blue-600">
                <div class="p-6">
                    <div class="flex items-center justify-between">
                        <h2 class="account-title m-0">Historial Reproductivo para el Bovino con RGD {{ bovineRgd }}</h2>

                    </div>
                    <button @click="exportToPdf" class="btn-export-pdf transition duration-150 ease-in-out"
                        title="Exportar informe a PDF">
                        <i class="fas fa-file-pdf mr-2"></i>
                        Exportar PDF
                    </button>
                </div>
            </header>

            <div class="flex-grow overflow-y-auto bg-white shadow-xl rounded-xl p-6 lg:p-8 border border-gray-100">

                <div v-if="isLoading" class="loading-container">
                    <div class="spinner-container">
                        <div class="pulsing-circle"></div>
                    </div>
                    <div class="text-container">
                        <p class="loading-text">{{ loadingText }}</p>
                    </div>
                </div>


                <div v-else-if="!bovineHistory"
                    class="text-center py-12 text-red-600 border-2 border-dashed border-red-300 p-8 rounded-lg">
                    <i class="fas fa-times-circle fa-3x mb-4"></i>
                    <p class="text-xl font-semibold">ERROR: No se pudo acceder o encontrar el historial reproductivo.
                    </p>
                    <p class="text-sm text-gray-500 mt-2">Verifique los parámetros de búsqueda. No se generó el informe.
                    </p>
                </div>

                <div v-else id="report-content">

                    <div class="mb-10 pt-4 border-t border-gray-200">
                        <h3 class="section-title">
                            <i class="fas fa-syringe mr-3 text-blue-600"></i>
                            Presincronización
                        </h3>
                        <div v-if="bovineHistory.pre_sincronization.length" class="table-container">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 sticky-table-header">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Fecha Aplicación</th>
                                        <th scope="col">Vacuna Reprod.</th>
                                        <th scope="col">Producto Sincrogest</th>
                                        <th scope="col">Antiparasitario</th>
                                        <th scope="col">Vitaminas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bovineHistory.pre_sincronization"
                                        :key="item.id || index" class="hover:bg-gray-50 transition duration-150">
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'id') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'application_date') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'reproductive_vaccine') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'sincrogest_product') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'antiparasitic_product') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'vitamins_and_minerals') }}</pre>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="empty-message"><i class="fas fa-info-circle mr-2"></i> No se registraron
                            protocolos de presincronización.</p>
                    </div>

                    <div class="mb-10 pt-4 border-t border-gray-200">
                        <h3 class="section-title">
                            <i class="fas fa-lungs mr-3 text-green-600"></i>
                            Ecografía
                        </h3>
                        <div v-if="bovineHistory.ultrasound.length" class="table-container">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 sticky-table-header">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Vitaminas Aplicadas</th>
                                        <th scope="col">Detalles Protocolo</th>
                                        <th scope="col">Equipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bovineHistory.ultrasound" :key="item.id || index"
                                        class="hover:bg-gray-50 transition duration-150">
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'id') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'date') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'status') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'vitamins_and_minerals') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'protocol_details') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'work_team') }}</pre>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="empty-message"><i class="fas fa-info-circle mr-2"></i> No se registraron
                            ecografías generales o de implante.</p>
                    </div>

                    <div class="mb-10 pt-4 border-t border-gray-200">
                        <h3 class="section-title">
                            <i class="fas fa-hand-holding-medical mr-3 text-orange-600"></i>
                            Retiro de Implante
                        </h3>
                        <div v-if="bovineHistory.implant_retrieval.length" class="table-container">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 sticky-table-header">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Estado del Dispositivo</th>
                                        <th scope="col">Equipo de Trabajo</th>
                                        <th scope="col">Productos Usados (Resumen)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bovineHistory.implant_retrieval" :key="item.id || index"
                                        class="hover:bg-gray-50 transition duration-150">
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'id') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'date') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'status') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'work_team') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'used_products_summary') }}</pre>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="empty-message"><i class="fas fa-info-circle mr-2"></i> No se registraron
                            retiros de dispositivos o implantes.</p>
                    </div>

                    <div class="mb-10 pt-4 border-t border-gray-200">
                        <h3 class="section-title">
                            <i class="fas fa-flask mr-3 text-red-600"></i>
                            Inseminaciones
                        </h3>
                        <div v-if="bovineHistory.inseminations.length" class="table-container">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 sticky-table-header">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Toro</th>
                                        <th scope="col">CC</th>
                                        <th scope="col">Calidad Celo</th>
                                        <th scope="col">Observación</th>
                                        <th scope="col">Notas Adicionales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bovineHistory.inseminations" :key="item.id || index"
                                        class="hover:bg-gray-50 transition duration-150">
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'id') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'date') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'bull') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'body_condition_score') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'heat_quality') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'observation') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'others') }}</pre>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="empty-message"><i class="fas fa-info-circle mr-2"></i> No se registraron
                            eventos de Inseminación Artificial.</p>
                    </div>

                    <div class="mb-10 pt-4 border-t border-gray-200">
                        <h3 class="section-title">
                            <i class="fas fa-baby mr-3 text-purple-600"></i>
                            Ecografías de Confirmación
                        </h3>
                        <div v-if="bovineHistory.confirmatory_ultrasounds.length" class="table-container">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 sticky-table-header">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Estado de Gestación</th>
                                        <th scope="col">Observación/Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bovineHistory.confirmatory_ultrasounds"
                                        :key="item.id || index" class="hover:bg-gray-50 transition duration-150">
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'id') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'date') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'status') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'observation') }}</pre>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="empty-message"><i class="fas fa-info-circle mr-2"></i> No se registraron
                            ecografías confirmatorias de gestación.</p>
                    </div>

                    <div class="mb-10 pt-4 border-t border-gray-200">
                        <h3 class="section-title">
                            <i class="fas fa-hand-paper mr-3 text-cyan-600"></i>
                            Palpacion General
                        </h3>
                        <div v-if="bovineHistory.general_palpation.length" class="table-container">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 sticky-table-header">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col">Observación/Detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bovineHistory.general_palpation" :key="item.id || index"
                                        class="hover:bg-gray-50 transition duration-150">
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'id') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'date') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'status') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'observation') }}</pre>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="empty-message"><i class="fas fa-info-circle mr-2"></i> No se registraron
                            palpaciones generales.</p>
                    </div>

                    <div class="mb-4 pt-4 border-t border-gray-200">
                        <h3 class="section-title">
                            <i class="fas fa-paw mr-3 text-pink-600"></i>
                            Parto
                        </h3>
                        <div v-if="bovineHistory.births.length" class="table-container">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50 sticky-table-header">
                                    <tr>
                                        <th scope="col">ID Parto</th>
                                        <th scope="col">Fecha de Parto</th>
                                        <th scope="col">Sexo Cría</th>
                                        <th scope="col">Peso al Nacer (kg)</th>
                                        <th scope="col">RGD Cría</th>
                                        <th scope="col">Tipo de Parto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bovineHistory.births" :key="item.id || index"
                                        class="hover:bg-gray-50 transition duration-150">
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'id') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'birthdate') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'sex') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'birth_weight') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'rgd') }}</pre>
                                        </td>
                                        <td class="table-data">
                                            <pre>{{ formatValue(item, 'type_of_birth') }}</pre>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="empty-message"><i class="fas fa-info-circle mr-2"></i> No se registraron
                            eventos de partos o nacimientos.</p>
                    </div>

                </div>
            </div>
        </div>
    </LayoutApp>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BovineReportService } from '@/services/report/BovineReportService';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import LayoutApp from '../LayoutApp.vue';
// Importamos jsPDF y nos aseguramos que autotable se cargue
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';// Importa el plugin, no necesita ser asignado a una variable

// --- Composables y Stores ---
const route = useRoute();
const sessionPropertyStore = useSessionPropertyStore();

// --- Estado ---
const bovineId = route.query.id;
const propertyId = sessionPropertyStore.getPropertyId;
const bovineRgd = route.query.rgd;
const name = sessionPropertyStore.getName;
const owner = sessionPropertyStore.getOwner;
const bovineHistory = ref(null);
const isLoading = ref(true);
const loadingText = ref('Procesando informacion historica del ejemplar...');

// --- Funciones de Utilidad ---

/**
 * Función para formatear el valor de la celda.
 * Simplificada para el PDF: Usamos el valor directo o un guion.
 */
const formatValue = (item, field) => {
    const value = item[field];

    if (value === null || value === undefined || value === '') {
        return '-';
    }

    if (field === 'vitamins_and_minerals' && typeof value === 'boolean') {
        return value ? 'Sí' : 'No';
    }

    // Para objetos/arrays que no son el valor principal, mostramos un resumen.
    if (typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value).length > 0 ? '[Datos Omitidos]' : '-';
    }

    return value;
};

function exportToPdf() {
    if (!bovineHistory.value) {
        alert("No se puede generar el PDF: No hay historial disponible.");
        return;
    }

    // Obtener la fecha actual para el reporte
    const reportDate = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });

    // 1. Inicializar el Documento
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });
    let y = 15; // Posición inicial Y

    // 2. Título y Metadatos del Encabezado
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 152, 219);
    doc.text("INFORME DE HISTORIAL REPRODUCTIVO BOVINO", 15, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);

    // Fila 1 de datos de cabecera
    doc.text(`RGD Bovino: ${bovineRgd || 'N/A'}`, 15, y);
    doc.text(`Propiedad: ${name || 'No definido'}`, 100, y);
    doc.text(`Dueño: ${owner || 'No definido'}`, 200, y);
    
    y += 5; // Salto para la siguiente fila de datos

    // Fila 2 de datos de cabecera (Fecha de Reporte)
    // Se inserta la fecha aquí
    doc.setFont('helvetica', 'italic');
    doc.text(`Fecha de Reporte: ${reportDate}`, 15, y);
    doc.setFont('helvetica', 'normal'); // Volver a normal para el resto del texto
    
    y += 5;

    // Línea separadora
    doc.setDrawColor(200);
    doc.line(15, y, 280, y);
    y += 8;

    // 3. Definiciones de Tablas
    const history = bovineHistory.value;

    const tableDefinitions = [
        {
            title: "1. Presincronización",
            dataKey: 'pre_sincronization',
            headers: ['ID', 'Fecha Aplicación', 'Vacuna Reprod.', 'Producto Sincrogest', 'Antiparasitario', 'Vitaminas'],
            keys: ['id', 'application_date', 'reproductive_vaccine', 'sincrogest_product', 'antiparasitic_product', 'vitamins_and_minerals']
        },
        {
            title: "2. Ecografía General",
            dataKey: 'ultrasound',
            headers: ['ID', 'Fecha', 'Estado', 'Vitaminas Aplicadas', 'Detalles Protocolo', 'Equipo'],
            keys: ['id', 'date', 'status', 'vitamins_and_minerals', 'protocol_details', 'work_team']
        },
        {
            title: "3. Retiro de Implante",
            dataKey: 'implant_retrieval',
            headers: ['ID', 'Fecha', 'Estado del Dispositivo', 'Equipo de Trabajo', 'Productos Usados'],
            keys: ['id', 'date', 'status', 'work_team', 'used_products_summary']
        },
        {
            title: "4. Inseminaciones",
            dataKey: 'inseminations',
            headers: ['ID', 'Fecha', 'Toro', 'CC', 'Calidad Celo', 'Observación', 'Notas Adicionales'],
            keys: ['id', 'date', 'bull', 'body_condition_score', 'heat_quality', 'observation', 'others']
        },
        {
            title: "5. Ecografías de Confirmación",
            dataKey: 'confirmatory_ultrasounds',
            headers: ['ID', 'Fecha', 'Estado de Gestación', 'Observación/Comentarios'],
            keys: ['id', 'date', 'status', 'observation']
        },
        {
            title: "6. Palpación General",
            dataKey: 'general_palpation',
            headers: ['ID', 'Fecha', 'Estado', 'Observación/Detalles'],
            keys: ['id', 'date', 'status', 'observation']
        },
        {
            title: "7. Partos",
            dataKey: 'births',
            headers: ['ID Parto', 'Fecha de Parto', 'Sexo Cría', 'Peso al Nacer (kg)', 'RGD Cría', 'Tipo de Parto'],
            keys: ['id', 'birthdate', 'sex', 'birth_weight', 'rgd', 'type_of_birth']
        },
    ];

    // Función para dibujar una sección de tabla
    const drawTable = (def, data) => {
        // Verificar si se necesita una nueva página
        if (y + 40 > doc.internal.pageSize.height) {
            doc.addPage();
            y = 15;
        }

        // Título de la Sección
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(39, 174, 96);
        doc.text(def.title, 15, y);
        y += 5;

        if (data.length === 0) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(150, 150, 150);
            doc.text("No se registraron datos para esta etapa.", 15, y + 5);
            y += 10;
        } else {
            // Preparar filas
            const rows = data.map(item => def.keys.map(key => formatValue(item, key)));

            // Llamada a la función autoTable
            autoTable(doc, {
                startY: y + 2,
                head: [def.headers],
                body: rows,
                theme: 'striped',
                styles: { fontSize: 8, cellPadding: 1, overflow: 'linebreak' },
                headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { left: 15, right: 15 },
                didDrawPage: function (data) {
                    // Pie de página con número de página
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.text('Página ' + doc.internal.getCurrentPageInfo().pageNumber + ' de ' + pageCount,
                        data.settings.margin.left,
                        doc.internal.pageSize.height - 5);
                }
            });

            // Actualizar la posición Y solo si doc.autoTable.previous existe
            if (doc.autoTable && doc.autoTable.previous) {
                y = doc.autoTable.previous.finalY + 8;
            } else {
                // Fallback: Si no se puede obtener la posición, avanzar manualmente.
                y += 50;
            }
        }
    };

    // Recorrer las secciones y dibujar
    tableDefinitions.forEach(def => drawTable(def, history[def.dataKey]));


    // 4. Guardar el PDF
    doc.save(`REPORTE_REPRODUCTIVO_${bovineRgd}.pdf`);
}


onMounted(() => {
    if (!bovineId || !propertyId) {
        console.error("Faltan parámetros de bovino o propiedad.");
        isLoading.value = false;
        return;
    }
    fetchBovineHistory(bovineId, propertyId);
});

async function fetchBovineHistory(id, propId) {
    isLoading.value = true;
    try {
        const history = await BovineReportService.getBovineHistory(id, propId);

        // REFUERZO DE NORMALIZACIÓN
        const normalized = {
            inseminations: history.inseminations || [],
            confirmatory_ultrasounds: history.confirmatory_ultrasounds || [],
            births: history.births || [],

            // Objetos únicos forzados a ser arrays de 0 o 1 elemento
            ultrasound: Array.isArray(history.ultrasound) ? history.ultrasound : (history.ultrasound && typeof history.ultrasound === 'object' ? [history.ultrasound] : []),
            pre_sincronization: Array.isArray(history.pre_sincronization) ? history.pre_sincronization : (history.pre_sincronization && typeof history.pre_sincronization === 'object' ? [history.pre_sincronization] : []),
            implant_retrieval: Array.isArray(history.implant_retrieval) ? history.implant_retrieval : (history.implant_retrieval && typeof history.implant_retrieval === 'object' ? [history.implant_retrieval] : []),
            general_palpation: Array.isArray(history.general_palpation) ? history.general_palpation : (history.general_palpation && typeof history.general_palpation === 'object' ? [history.general_palpation] : []),
        };

        bovineHistory.value = Object.freeze(normalized);

    } catch (error) {
        console.error("Error al obtener el historial:", error);
        bovineHistory.value = null;
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.max-w-7xl.mx-auto.px-6.py-6.lg\:px-10.lg\:py-8 {
    height: calc(100vh - 5rem);
    /* Altura dinámica */
    overflow-y: auto;
    /* Habilita el scroll en este div */
    display: flex;
    flex-direction: column;
    font-family: 'Poppins', sans-serif;
    /* Aplicamos el fondo degradado para el look de Naturaleza */
    background: linear-gradient(135deg, #e6f4ea 0%, #b6e2c7 100%);
}


.sticky-header {
    position: sticky;
    top: 0;
    background-color: #4F7B3A;
    box-shadow: 0 6px 15px -3px rgba(0, 0, 0, 0.15), 0 3px 8px -2px rgba(0, 0, 0, 0.08);

    z-index: 50;
    /* Aumentamos el z-index para asegurar que cubra todo */

    /* Borde de Marca: Añade una línea de color corporativo en la parte inferior */
    border-bottom: 4px solid #388e3c;
    /* Tono de verde corporativo más oscuro */

    /* Mantener esquinas superiores redondeadas (estilo de tarjeta) */
    border-radius: 16px 16px 0 0;

    /* Transición suave para cualquier efecto visual al desplazarse */
    transition: all 0.3s ease-in-out;

}

.section-title {
    color: #1c3d31;
    border-color: #d9f99d;
}

.table-container {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #b6e2c7;
}

.sticky-table-header th {
    padding: 1rem 2rem;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: #1c3d31;
    background-color: #e6f4ea;
    border-bottom: 2px solid #a3e635;
    position: sticky;
    top: 0;
    z-index: 5;
}

.table-data {
    padding: 1rem 2rem;
    text-align: center;
    white-space: normal;
    font-size: 0.9rem;
    color: #374151;
    border-bottom: 1px solid #f0fdf4;
    background-color: #f6fff8;
    vertical-align: top;
}

pre {
    color: #374151;
    font-weight: 400;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: center;
    margin: 0 auto;
}

.empty-message {
    color: #4b5563;
    background-color: #f7fee7;
    border-color: #d9f99d;
    text-align: center;
}

.whitespace-normal {
    white-space: normal;
}

.btn-export-pdf {
    background-color: #f0fdf4;
    color: #43a047;
    border: 1px solid #b6e2c7;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.btn-export-pdf:hover {
    background-color: #43a047;
    color: white;
    border-color: #388e3c;
    transform: translateY(-1px);
}

.btn-export-pdf .fa-file-pdf {
    color: #43a047;
}

.btn-export-pdf:hover .fa-file-pdf {
    color: white;
}

.spinner-container {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    width: 100%;
    height: 100%;
    min-height: 80vh;
}

.pulsing-circle {
    width: 100px;
    height: 100px;
    background-color: #388e3c;
    border-radius: 50%;
    opacity: 0.5;
    animation: pulse 2s infinite ease-out;
}

.account-title {
    color: #388e3c;
    text-align: center;
    margin-bottom: 2rem;
    font-weight: 700;
}

.loading-text {
    font-size: 1.2rem;
    font-weight: 500;
    color: #388e3c;
    animation: fade 2s infinite;
}
</style>