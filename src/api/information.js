import { client } from './client';

export const getInformation = (data) => {
    const params = {};
    if (data) {
        params.from = data.from;
        params.to = data.to;
    }
    return client.get('/information', { params })
};

