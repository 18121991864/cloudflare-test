import http from '@/servers/index';

export class Api {
    protected api: http;

    constructor(url?: string) {
        const baseUrl: string = String(import.meta.env.VITE_APP_BASE_URL);
        this.api = new http({
            baseURL: url ? `${baseUrl}${url}` : `${baseUrl}`,
        });
    }
    useHttp(url?: string) {
        if (url) {
            const baseURl: string = String(import.meta.env.VITE_APP_BASE_URL);
            this.api.usebaseURL(`${baseURl}/${url}`);
        }

        return this.api;
    }
}
