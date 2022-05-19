export interface CustomerForm {
  id?: number;
  name: string;
  hotline: string;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: CustomerForm) => void;
  type: 'create' | 'update';
  initialValues?: CustomerForm;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
}
