/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';

export interface TrunkList {
  groupIps: TrunkInfo[];
}

export interface TrunkInfo {
  id: string;
  ip: string;
  port: string;
  groupCode: string;
  groupName: string;
  trunkName: string;
  status: number;
}

export interface TelecomList {
  groups: TelecomInfo[];
}

export interface TelecomInfo {
  id: string;
  groupName: string;
  groupCode: string;
}

export interface CreateTrunkInfo {
  groupName?: string;
  trunkName: string;
  ip: string;
  port: string;
}

export interface UpdateTrunkInfo extends CreateTrunkInfo {
  groupCode: string;
  trunkId: string;
  status: number;
}

export default class TrunkAPI {
  static getListTrunk = async () => {
    return await httpService.get<TrunkList>('/group/*/ip');
  };

  static getTelecom = async () => {
    return await httpService.get<TelecomList>('/group');
  };

  static createNewTrunk = async (data: CreateTrunkInfo) => {
    const { groupName, ...rest } = data;

    return await httpService.post<TrunkInfo>(`/group/${groupName}/ip`, {
      body: { ...rest },
    });
  };

  static updateTrunk = async (data: UpdateTrunkInfo) => {
    const { trunkId, groupCode, ...rest } = data;
    return await httpService.put<any>(`/group/${groupCode}/ip/${trunkId}`, {
      body: { ...rest },
    });
  };
}
