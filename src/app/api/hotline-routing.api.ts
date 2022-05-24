/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';

export interface HotlineRoutingInfo {
  hotlines: Hotline[];
}

export interface Hotline {
  hotlines: string[];
  host: string;
  port: string;
  customerName: string;
  customerId: number;
}

export default class HotlineRoutingAPI {
  static getListHotlineRouting = async () => {
    return await httpService.get<HotlineRoutingInfo>('/hotline');
  };
}
