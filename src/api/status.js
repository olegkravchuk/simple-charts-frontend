import { client } from './client';

export const getStatuses = () => client.get('/statuses');

