import { client } from './client';

export const getCompanies = () => client.get('/companies');

