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

export interface CustomerDetail {
  customerVIps: CustomerVIps[];
  hotlines: Hotline[];
}

export interface Hotline {
  customerId: number | string;
  customerName: string;
  hotlines: string[];
}

export interface CustomerVIps extends CustomerInfo {
  customerId: string | number;
  customerVIps: string[];
}

export interface CreateCustomerParams {
  customerName: string;
  description: string;
  hotlines: string;
  virtualnumbers: string;
}

export interface UpdateCustomerParams {
  customerId: string | number;
  customerName: string;
  description: string;
}

interface UpdateCustomerVirtual {
  customerId: string | number;
  virtualNumber: string;
}

interface AddNewHotline {
  msisdn: string;
  customerId: string | number;
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
    return await httpService.get<CustomerDetail>(`/customer/${id}/all`);
  };

  static updateCustomer = async (params: UpdateCustomerParams) => {
    const { customerId, ...rest } = params;
    return await httpService.put(`/customer/${customerId}`, {
      body: { ...rest },
    });
  };

  static updateVirtualNumber = async ({
    customerId,
    virtualNumber,
  }: UpdateCustomerVirtual) => {
    return await httpService.put(`/customer/1/virtual-number/${customerId}`, {
      body: { virtualNumber },
    });
  };

  static addHotline = async ({ customerId, msisdn }: AddNewHotline) => {
    return await httpService.put(`/hotline`, {
      body: {
        msisdn,
        customerId,
        groupIpId: 0,
      },
    });
  };

  static deleteHotline = async (hotline: string) => {
    return await httpService.put(`/hotline/${hotline}`, {
      body: {
        groupIpId: 0,
        status: 0,
      },
    });
  };
}
