import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';

const rows = [
  {
    id: 1,
    customerName: 'Snow',
    trunkName: 1,
    virtual: '11111111, 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 0,
  },
  {
    id: 2,
    customerName: 'John',
    trunkName: 1,
    virtual: '11111111, 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 0,
  },
  {
    id: 3,
    customerName: 'Thang',
    trunkName: 1,
    virtual: '11111111, 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 1,
  },
  {
    id: 4,
    customerName: 'Ngoc',
    trunkName: 2,
    virtual: '11111111, 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 1,
  },
  {
    id: 5,
    customerName: 'Anh',
    trunkName: 2,
    virtual: '11111111, 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 0,
  },
  {
    id: 6,
    customerName: 'Nguyen',
    trunkName: 3,
    virtual: '11111111, 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 0,
  },
];

export const PREVIEW_CONFIG: GridColDef[] = [
  { field: 'id', headerName: 'No', flex: 0.5 },
  { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
  { field: 'trunkName', headerName: 'Tên Trunk', flex: 1 },
  { field: 'virtual', headerName: 'Virtual', flex: 1 },
  { field: 'ipPort', headerName: 'IP:PORT', flex: 1 },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.status ? 'Active' : 'Disable',
  },
];

function VirtualRouting() {
  const { changePageSize, pageSize } = useChangePageSize();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'No', flex: 0.5 },
    { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
    { field: 'trunkName', headerName: 'Tên Trunk', flex: 1.25 },
    { field: 'virtual', headerName: 'Virtual', flex: 1.25 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.75,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.status ? 'Active' : 'Disable',
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1.25,
      sortable: false,
      renderCell: (cellValues) => {
        return <CellAction />;
      },
    },
  ]).current;

  const handleCreateVirtual = () => {};

  return (
    <Container maxWidth="xl" className="table-page">
      <Helmet>
        <title>Virtual Routing Page</title>
      </Helmet>

      <div className="create-button">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className="admin-button --no-transform"
          onClick={handleCreateVirtual}
        >
          Tạo mới
        </Button>
      </div>

      <div className="data-grid">
        <DataGrid
          rows={rows}
          columns={COLUMN_CONFIG}
          pageSize={pageSize}
          onPageSizeChange={changePageSize}
          rowsPerPageOptions={ROW_PAGE_OPTIONS}
          disableColumnMenu
          autoHeight
          hideFooterSelectedRowCount
          components={{ Row: CustomRow }}
        />
      </div>
    </Container>
  );
}

export default VirtualRouting;
