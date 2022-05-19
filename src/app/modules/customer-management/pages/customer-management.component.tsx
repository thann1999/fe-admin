import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import useCustomerDialog from '../components/customer-dialog/customer-dialog.component';
import { CustomerForm } from '../shared/customer-dialog.type';

const rows = [
  {
    id: 1,
    name: 'Snow',
    hotline: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
  },
  {
    id: 2,
    name: 'Lannister',
    hotline: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
  },
  {
    id: 3,
    name: 'Lannister',
    hotline: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
  },
  {
    id: 4,
    name: 'Stark',
    hotline: '11111111, 9744124556, 9744124556, 9744124556 , 9744124556',
  },
];

function TrunkManagement() {
  const { openCustomerDialog, CustomerDialog, closeCustomerDialog } =
    useCustomerDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'No', flex: 0.5 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'hotline', headerName: 'Hotline', flex: 1.5 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => {
        const { name, hotline, id } = cellValues.row;
        return (
          <CellAction
            viewAble={false}
            handleEdit={() =>
              handleEdit({
                name,
                hotline,
                id,
              })
            }
            deleteDialogInfo={{
              title: 'Xóa Khách hàng?',
              type: 'error',
              description:
                'Bạn có thực sự muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
              handleConfirm: () => onDelete({ name, hotline, id }),
            }}
          />
        );
      },
    },
  ]).current;

  const onCreate = (data: CustomerForm) => {
    // TODO: Call api create
    closeCustomerDialog();
  };

  const onUpdate = (data: CustomerForm) => {
    // TODO: Call api update
    closeCustomerDialog();
  };

  const onDelete = (data: CustomerForm) => {
    closeCustomerDialog();
  };

  const handleEdit = (initialValues: CustomerForm) => {
    openCustomerDialog({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhật Khách hàng',
      type: 'update',
    });
  };

  const handleCreateCustomer = () => {
    openCustomerDialog({
      onSubmit: onCreate,
      title: 'Tạo mới Khách hàng',
      type: 'create',
    });
  };

  return (
    <Container maxWidth="xl" className="table-page">
      <Helmet>
        <title>Customer Management Page</title>
      </Helmet>

      <div className="create-button">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className="admin-button --no-transform"
          onClick={handleCreateCustomer}
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

      <CustomerDialog />
    </Container>
  );
}

export default TrunkManagement;
