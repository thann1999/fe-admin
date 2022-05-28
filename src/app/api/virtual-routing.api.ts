/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';
import { VirtualNumberGroup } from './customer.api';

export interface VirtualRoutingList {
  virtualNumberGroups: VirtualRouting[];
}

export interface VirtualRouting extends VirtualNumberGroup {
  vngTrunks: VngTrunk[];
}

interface VngTrunk {
  groupCode: string;
  groupName: string;
  ip: string;
  port: string;
  trunkId: number;
  trunkName: string;
  vngtId: string;
}

interface SetTrunkParams {
  trunkId: string | number;
  customerId: number | string;
  vngId: string | number;
}

export default class VirtualRoutingAPI {
  static getListVirtualRouting = async () => {
    return await httpService.get<VirtualRoutingList>('/virtual-number');
  };

  static setTrunkToGroupVirtual = async (params: SetTrunkParams) => {
    const { customerId, vngId, trunkId } = params;
    return await httpService.post(
      `/customer/${customerId}/virtual-number-group/${vngId}/trunk`,
      {
        body: { trunkId },
      }
    );
  };
}
