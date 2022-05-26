import { HotlineGroups } from 'app/api/customer.api';
import { SelectItem } from 'shared/form/select/select-controller.component';

export interface GroupHotlineForm {
  id?: number;
  customerId: number;
  groupHotlineName: string;
  stringHotline: string;
  hotline: SelectItem[];
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
