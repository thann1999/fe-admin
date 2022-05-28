import { VirtualRouting } from 'app/api/virtual-routing.api';
import { SelectItem } from 'shared/form/select/select-controller.component';

export interface RoutingForm {
  customerId: number | string;
  customerName: string;
  virtualGroupId: string;
  virtualGroupName: string;
  trunkId: (string | number)[];
  status?: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: RoutingForm) => void;
  listCustomerGroup?: VirtualRouting[];
  isUpdate?: boolean;
  initialValues?: VirtualRouting;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  customerGroupOptions: SelectItem[];
}
