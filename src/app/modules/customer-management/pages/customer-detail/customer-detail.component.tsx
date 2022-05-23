import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import useCustomerDialog from '../../components/customer-dialog/customer-dialog.component';
import { CustomerForm } from '../../shared/customer-dialog.type';
import './customer-detail.style.scss';

const rows = [
  {
    id: 1,
    name: 'Thang',
    description: 'This is description',
    hotline: `11111111, 9744124556, 123456, 11111111, 9744124556, 123456, 11111111, 
      9744124556, 123456, 11111111, 9744124556, 12345611111111, 
      9744124556, 123456, 11111111, 9744124556, 123456, 11111111, 
      9744124556, 123456, 11111111, 9744124556, 12345611111111, 
      9744124556, 123456, 11111111, 9744124556, 123456, 11111111, 
      9744124556, 123456, 11111111, 9744124556, 123456 
      9744124556, 123456, 11111111, 9744124556, 123456
      9744124556, 123456, 11111111, 9744124556, 123456
      9744124556, 123456, 11111111, 9744124556, 123456
      9744124556, 123456, 11111111, 9744124556, 123456`,
    virtual: '11111111, 9744124556, 123456, 11111111, 9744124556, 123456',
  },
];

function CustomerDetail() {
  const { openCustomerDialog, CustomerDialog, closeCustomerDialog } =
    useCustomerDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'hotline', headerName: 'Số Hotline', flex: 1 },
    { field: 'virtual', headerName: 'Số Virtual', flex: 1 },
    {
      field: 'action',
      headerName: 'Chức năng',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => (
        <CellAction
          viewAble={false}
          handleEdit={() => handleEdit(cellValues.row)}
          deleteDialogInfo={{
            title: 'Xóa Khách hàng?',
            type: 'error',
            description:
              'Bạn có thực sự muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
            handleConfirm: () => onDelete(cellValues.row),
          }}
        />
      ),
    },
  ]).current;

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
      isUpdate: true,
    });
  };

  return (
    <Container maxWidth="xl" className="customer-detail">
      <Helmet>
        <title>Customer Detail Page</title>
      </Helmet>

      <div className="data-grid">
        <DataGrid
          rows={rows}
          columns={COLUMN_CONFIG}
          pageSize={10}
          rowHeight={192}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          disableColumnMenu
          hideFooter
        />
      </div>

      <CustomerDialog />
    </Container>
  );
}

export default CustomerDetail;
