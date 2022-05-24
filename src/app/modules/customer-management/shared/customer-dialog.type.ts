import { SelectItem } from 'shared/form/select/select-controller.component';
import { CustomerInfo } from '../pages/customer-detail/customer-detail.component';

export interface CustomerForm {
  id: string | number;
  customerName: string;
  hotline?: string;
  virtual?: string;
  editHotline: SelectItem[]; // Required
  editVirtual: SelectItem[]; // Required
  description: string;
  status: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit?: (data: CustomerForm) => void;
  isUpdate?: boolean;
  initialValues?: CustomerInfo;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  hotlineOptions: SelectItem[];
  virtualOptions: SelectItem[];
}
