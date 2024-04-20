import axios, { AxiosResponse, AxiosError } from 'axios';


interface RequestOptions {
    method: 'get' | 'post' | 'put' | 'delete';
    body?: any;
    url: string;
    token?: any;
}

async function sendRequest({ method, body, url, token }: RequestOptions): Promise<AxiosResponse> {
    try {

        var ENDPOINT = 'http://localhost/api'+url;

        if ( token ) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (method === 'get') {
            return await axios.get(ENDPOINT);
        } else if (method === 'post') {
            return await axios.post(ENDPOINT, body);
        } else if (method === 'put') {
            return await axios.put(ENDPOINT, body);
        } else if (method === 'delete') {
            return await axios.delete(ENDPOINT);
        } else {
            throw new Error('Método inválido');
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 400) {
                // Tratar o erro 400 aqui
                console.error('Erro 400: Solicitação inválida');
                console.error('Detalhes:', axiosError.response.data);
            } else {
                // Tratar outros erros de rede ou do servidor
                console.error('Erro na requisição:', axiosError.message);
            }
        } else {
            // Tratar outros erros de JavaScript
            throw new Error(`Erro inesperado: ${error}`);
        }
        throw new Error(`Erro na requisição: ${error}`);
    }
}

export default sendRequest;
