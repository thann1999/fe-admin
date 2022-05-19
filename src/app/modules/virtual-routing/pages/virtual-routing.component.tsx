import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import usePreviewDialog from 'shared/blocks/preview-dialog/preview-dialog.component';
import useRoutingDialog from 'shared/blocks/routing-dialog/routing-dialog.component';
import { RoutingForm } from 'shared/blocks/routing-dialog/routing-dialog.type';

const rows = [
  {
    id: 1,
    customerName: 'Snow',
    trunkName: 1,
    virtual: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 0,
  },
  {
    id: 2,
    customerName: 'John',
    trunkName: 1,
    virtual: '11111111, 9744124556, 9744124556, 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 0,
  },
  {
    id: 3,
    customerName: 'Thang',
    trunkName: 1,
    virtual: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 1,
  },
  {
    id: 4,
    customerName: 'Ngoc',
    trunkName: 2,
    virtual: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 1,
  },
  {
    id: 5,
    customerName: 'Anh',
    trunkName: 2,
    virtual: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
    ipPort: '192.168.1.1:3006',
    status: 0,
  },
  {
    id: 6,
    customerName: 'Nguyen',
    trunkName: 3,
    virtual: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
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
  const { RoutingDialog, closeRoutingDialog, openRoutingDialog } =
    useRoutingDialog({ isHotlineDialog: false });
  const { PreviewDialog, openPreviewDialog } = usePreviewDialog({
    columnConfig: PREVIEW_CONFIG,
  });

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
        return (
          <CellAction
            handleEdit={() => handleEdit(cellValues.row)}
            deleteDialogInfo={{
              title: 'Xóa Virtual?',
              type: 'error',
              description:
                'Bạn có thực sự muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
              handleConfirm: () => onDelete(cellValues.row),
            }}
            handleView={() => handleViewInfo(cellValues.row)}
          />
        );
      },
    },
  ]).current;

  const onCreate = (data: RoutingForm) => {
    // TODO: Call api create
    closeRoutingDialog();
  };

  const onUpdate = (data: RoutingForm) => {
    // TODO: Call api update
    closeRoutingDialog();
  };

  const onDelete = (data: RoutingForm) => {
    // TODO: Call api delete
    closeRoutingDialog();
  };

  const handleViewInfo = (data: RoutingForm) => {
    openPreviewDialog({
      title: 'Thông tin chi tiết Virtual',
      values: data,
    });
  };

  const handleEdit = (initialValues: RoutingForm) => {
    console.log(initialValues);
    openRoutingDialog({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhật Virtual',
      type: 'update',
    });
  };

  const handleCreateVirtual = () => {
    openRoutingDialog({
      onSubmit: onCreate,
      title: 'Tạo mới Virtual',
      type: 'create',
    });
  };

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
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          disableColumnMenu
          hideFooterSelectedRowCount
        />
      </div>

      <RoutingDialog />
      <PreviewDialog />
    </Container>
  );
}

export default VirtualRouting;
