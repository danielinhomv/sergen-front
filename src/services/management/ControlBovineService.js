import { API_URL } from '@/environment/Api';
import { ControlBovine } from '@/model/management/ControlBovine';

const PREFIX = '/management/control-bovine';

export class ControlBovineService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    async createControlBovine(controlBovine) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(controlBovine.toJson()),
        });

        if (!response.ok) throw new Error('Error de red al crear Control Bovine');

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return ControlBovine.fromJson(data);
    }
}