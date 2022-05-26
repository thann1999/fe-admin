/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';

export interface CustomerList {
  customers: CustomerInfo[];
}

export interface CustomerInfo {
  id: number;
  customerName: string;
  description: string;
  status?: number;
}

export interface CreateCustomerParams {
  customerName: string;
  description: string;
}

export interface GroupHotlineList {
  hotlineGroups: HotlineGroups[];
}

export interface HotlineGroups {
  hotlineGroupId: number;
  hotlineGroupName: string;
  customerId: number;
  customerDisplayName: string;
  customerName: string;
  groupStatus: number;
  hotlines: Hotline[];
}

export interface Hotline {
  isdn: string;
  status: number;
  hotlineId: string;
}

interface CreateGroupHotlineInfo {
  customerId: number;
  groupHotlineName: string;
  isdns: string[];
}

interface CreateVirtualNumberGroup {
  customerId: number;
  vngName: string;
  isdns: string[];
}

export interface GroupVirtualList {
  virtualNumberGroups: VirtualNumberGroup[];
}

export interface VirtualNumberGroup {
  vngId: number;
  vngName: string;
  isdn: string;
  status: number;
  customerId: number;
  customerName: string;
  customerDisplayName: string;
  virtualNumbers: Hotline[];
}

export interface VirtualNumber {
  isdn: string;
  status: number;
  vnId: string;
}

export default class CustomerAPI {
  static getListCustomer = () => {
    return httpService.get<CustomerList>('/customer');
  };

  static createCustomer = (params: CreateCustomerParams) => {
    return httpService.post<CustomerInfo>('/customer', {
      body: params,
    });
  };

  static updateCustomer = (params: CustomerInfo) => {
    const { id, ...rest } = params;
    return httpService.put<CustomerInfo>(`/customer/${id}`, {
      body: { ...rest },
    });
  };

  static getListGroupHotline = () => {
    return httpService.get<GroupHotlineList>('/hotline');
  };

  static createGroupHotline = (params: CreateGroupHotlineInfo) => {
    const { customerId, ...rest } = params;
    return httpService.post(`/customer/${customerId}/hotline-group`, {
      body: { ...rest },
    });
  };

  static getListVirtual = () => {
    return httpService.get<GroupVirtualList>('/virtual-number');
  };

  static createGroupVirtual = (params: CreateVirtualNumberGroup) => {
    const { customerId, ...rest } = params;
    return httpService.post(`/customer/${customerId}/virtual-number-group`, {
      body: { ...rest },
    });
  };
}
