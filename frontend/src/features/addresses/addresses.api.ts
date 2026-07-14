import { httpClient } from '@/lib/http-client';

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  line1: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export type CreateAddressPayload = Omit<Address, 'id' | 'userId'>;

export const addressesApi = {
  list: () => httpClient.get<Address[]>('/addresses').then((res) => res.data),
  create: (payload: CreateAddressPayload) =>
    httpClient.post<Address>('/addresses', payload).then((res) => res.data),
  update: (id: string, payload: Partial<CreateAddressPayload>) =>
    httpClient.patch<Address>(`/addresses/${id}`, payload).then((res) => res.data),
  remove: (id: string) => httpClient.delete(`/addresses/${id}`),
};
