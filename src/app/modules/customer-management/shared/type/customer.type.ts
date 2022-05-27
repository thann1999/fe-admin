import { HotlineGroups, VirtualNumberGroup } from 'app/api/customer.api';

export interface HotlineGroupInfo extends HotlineGroups {
  id: number;
  stringHotline: string;
}

export interface VirtualGroupInfo extends VirtualNumberGroup {
  id: number;
  stringVirtual: string;
}
