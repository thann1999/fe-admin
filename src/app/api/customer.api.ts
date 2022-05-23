/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';

export interface CustomerList {
  customers: CustomerInfo[];
}

export interface CustomerInfo {
  id: string;
  customerName: string;
  description: string;
  status: number;
}

export interface CustomerDetailInfo {
  customerVIps: CustomerVIps[];
  hotlines: string[];
}

export interface CustomerVIps extends CustomerInfo {
  customerId: string;
  virtualNumber: string;
}

export interface CreateCustomerParams {
  customerName: string;
  description: string;
  hotlines: string;
  virtualnumbers: string;
}

export default class CustomerAPI {
  static getListCustomer = async () => {
    return await httpService.get<CustomerList>('/customer');
  };

  static createCustomer = async (params: CreateCustomerParams) => {
    return await httpService.post<CustomerInfo>('/customer', {
      body: params,
    });
  };

  static getDetailCustomer = async (id: string) => {
    return await httpService.get<CustomerDetailInfo>(`/customer/${id}/all`);
  };
}
