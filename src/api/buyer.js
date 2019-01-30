import { client } from './client';

export const getBuyers = () => client.get('/buyers');

