import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { HotlineForm } from './hotline-dialog.type';

export interface OpenDialogProps {
  title: string;
  values: HotlineForm;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
}

export const COLUMN_CONFIG: GridColDef[] = [
  { field: 'id', headerName: 'No', flex: 0.5 },
  { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
  { field: 'trunkName', headerName: 'Tên Trunk', flex: 1 },
  { field: 'hotline', headerName: 'Hotline', flex: 1 },
  { field: 'ipPort', headerName: 'IP:PORT', flex: 1 },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.status ? 'Active' : 'Disable',
  },
];
