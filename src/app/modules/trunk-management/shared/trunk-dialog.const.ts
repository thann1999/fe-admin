import { SelectItem } from 'shared/form/select/select-controller.component';

export const TELECOM_OPTIONS: SelectItem[] = [
  { label: 'Viettel', value: 1 },
  { label: 'Mobiphone', value: 2 },
  { label: 'Vinaphone', value: 3 },
  { label: 'Fix', value: 4 },
];

export interface TrunkForm {
  id?: number;
  name: string;
  ip: string;
  port: string;
  telecom: string | number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: TrunkForm) => void;
  type?: 'create' | 'update';
  initialValues?: TrunkForm;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
}
