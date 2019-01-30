import { client } from './client';

export const getRequesters = () => client.get('/requesters');

