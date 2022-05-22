import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import { useNavigate } from 'react-router-dom';
import useCustomerDialog from '../../components/customer-dialog/customer-dialog.component';
import { CustomerForm } from '../../shared/customer-dialog.type';

const rows = [
  {
    id: 1,
    customerName: 'Snow',
    description: 'This is description',
  },
  {
    id: 2,
    customerName: 'Lannister',
    description: 'This is description',
  },
  {
    id: 3,
    customerName: 'Lannister',
    description: 'This is description',
  },
  {
    id: 4,
    customerName: 'Stark',
    description: 'This is description',
  },
];

function CustomerManagement() {
  const { openCustomerDialog, CustomerDialog, closeCustomerDialog } =
    useCustomerDialog();
  const navigate = useNavigate();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
    { field: 'description', headerName: 'Mô tả', flex: 1 },
    {
      field: 'action',
      headerName: 'Chức năng',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => (
        <CellAction
          editAble={false}
          deleteAble={false}
          handleView={() => handleViewDetail(cellValues.row)}
        />
      ),
    },
  ]).current;

  const handleViewDetail = (data: CustomerForm) => {
    navigate(`detail/${data.id}`);
  };

  const onCreate = (data: CustomerForm) => {
    // TODO: Call api create
    closeCustomerDialog();
  };

  const handleCreateCustomer = () => {
    openCustomerDialog({
      onSubmit: onCreate,
      title: 'Tạo mới Khách hàng',
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

export default CustomerManagement;
