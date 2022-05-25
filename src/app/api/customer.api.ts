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
  customerId: number;
  customerName: string;
  hotlines: string[];
}

export interface CustomerVIps extends CustomerInfo {
  customerId: number;
  customerVIps: VirtualNumber[];
}

export interface CreateCustomerParams {
  customerName: string;
  description: string;
  hotlines: string;
  virtualnumbers: string;
}

export interface VirtualNumber {
  virtualNumber: string;
  id?: string;
}

export interface UpdateCustomerParams {
  customerId: number;
  customerName: string;
  description: string;
}

interface UpdateCustomerVirtual extends VirtualNumber {
  customerId: number;
}

interface AddNewHotline {
  msisdn: string;
  customerId: number;
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

  static deleteVirtualNumber = async ({
    customerId,
    virtualNumber,
    id,
  }: UpdateCustomerVirtual) => {
    return await httpService.put(
      `/customer/${customerId}/virtual-number/${id}`,
      {
        body: { virtualNumber },
      }
    );
  };

  static addVirtualNumber = async (params: UpdateCustomerVirtual) => {
    const { customerId, virtualNumber } = params;
    return await httpService.put(`/customer/${customerId}/virtual-number`, {
      body: { virtualNumber },
    });
  };

  static addHotline = async ({ customerId, msisdn }: AddNewHotline) => {
    return await httpService.put(`/hotline`, {
      body: {
        msisdn,
        customerId,
      },
    });
  };

  static deleteHotline = async (hotline: string) => {
    return await httpService.put(`/hotline/${hotline}`, {
      body: {
        status: 0,
      },
    });
  };
}
