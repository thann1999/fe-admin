import { HotlineGroups } from 'app/api/customer.api';
import { SelectItem } from 'shared/form/select/select-controller.component';

export interface GroupHotlineForm {
  customerId: number | string;
  groupHotlineName: string;
  stringHotline: string;
  hotline: SelectItem[];
  customerName?: string;
  status?: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: GroupHotlineForm) => void;
  isUpdate?: boolean;
  initialValues?: HotlineGroups;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  hotlineOptions: SelectItem[];
}
