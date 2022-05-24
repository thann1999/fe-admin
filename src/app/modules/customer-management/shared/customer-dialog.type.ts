import { SelectItem } from 'shared/form/select/select-controller.component';

export interface CustomerForm {
  id?: string;
  customerName: string;
  hotline?: string;
  virtual?: string;
  editHotline: SelectItem[]; // Required
  editVirtual: SelectItem[]; // Required
  description?: string;
  status: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: CustomerForm) => void;
  isUpdate?: boolean;
  initialValues?: CustomerForm;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  hotlineOptions: SelectItem[];
  virtualOptions: SelectItem[];
}
