import { SelectItem } from 'shared/form/select/select-controller.component';

export interface RoutingDialogProps {
  isHotlineDialog: boolean;
}

export interface RoutingForm {
  id?: number;
  customerName: string;
  trunkName: string;
  stringHotline?: string;
  hotline: SelectItem[];
  virtual?: string;
  ipPort: string;
  status: string;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: RoutingForm) => void;
  type: 'create' | 'update';
  initialValues?: RoutingForm;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  hotlineOptions: SelectItem[];
}

export const TRUNK_NAME_OPTIONS: SelectItem[] = [
  { label: 'VOS164 to VIETTEL', value: 1 },
  { label: 'VOS165 to VIETTEL', value: 2 },
  { label: 'VOS165 to MOBI', value: 3 },
  { label: 'VOS166 to MOBI', value: 4 },
  { label: 'VOS166 to VINA', value: 5 },
  { label: 'VOS167 to VINA', value: 6 },
];

export const STATUS_OPTIONS: SelectItem[] = [
  { label: 'Active', value: 1 },
  { label: 'Disable', value: 0 },
];
