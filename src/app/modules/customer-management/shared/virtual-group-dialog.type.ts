import { VirtualNumberGroup } from 'app/api/customer.api';
import { SelectItem } from 'shared/form/select/select-controller.component';

export interface GroupVirtualForm {
  id?: number;
  customerId: number;
  vngName: string;
  stringVirtual: string;
  virtual: SelectItem[];
  status?: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: GroupVirtualForm) => void;
  isUpdate?: boolean;
  initialValues?: VirtualNumberGroup;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  virtualOptions: SelectItem[];
}
