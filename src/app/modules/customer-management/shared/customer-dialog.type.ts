import { SelectItem } from 'shared/form/select/select-controller.component';
import { CustomerInfo } from '../pages/customer-detail/customer-detail.component';

export interface CustomerForm {
  id: number;
  customerName: string;
  hotline?: string;
  virtual?: string;
  editHotline: SelectItem[]; // Required
  editVirtual: SelectItem[]; // Required
  description: string;
}

export interface OpenDialogProps {
  title: string;
  onSubmit?: (data: CustomerForm) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCallAPIUpdate?: (callAPI: any[]) => void;
  isUpdate?: boolean;
  initialValues?: CustomerInfo;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  hotlineOptions: SelectItem[];
  virtualOptions: SelectItem[];
}
