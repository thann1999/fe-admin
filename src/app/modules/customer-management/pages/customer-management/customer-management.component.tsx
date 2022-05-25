import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import { useNavigate } from 'react-router-dom';
import CustomerAPI, { CustomerInfo } from 'app/api/customer.api';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { Message } from 'shared/const/message.const';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import useCustomerDialog from '../../components/customer-dialog/customer-dialog.component';
import { CustomerForm } from '../../shared/customer-dialog.type';

function CustomerManagement() {
  const { openCustomerDialog, CustomerDialog, closeCustomerDialog } =
    useCustomerDialog();
  const customerList = useRef<CustomerInfo[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { changePageSize, pageSize } = useChangePageSize();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'no', headerName: 'STT', flex: 0.2 },
    { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
    { field: 'description', headerName: 'Mô tả', flex: 1 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.5,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.status)?.label,
    },
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

  const onCreate = async (data: CustomerForm) => {
    try {
      const { description, hotline, virtual, customerName } = data;
      setLoading(true);
      await CustomerAPI.createCustomer({
        customerName,
        description: description || '',
        hotlines: hotline || '',
        virtualnumbers: virtual || '',
      });

      await getListCustomer();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
      closeCustomerDialog();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCreateCustomer = () => {
    openCustomerDialog({
      onSubmit: onCreate,
      title: 'Tạo mới Khách hàng',
    });
  };

  const getListCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getListCustomer();
      if (result) {
        customerList.current = result.customers.map((item, index) => ({
          ...item,
          no: index + 1,
        }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListCustomer();
  }, [getListCustomer]);

  return (
    <>
      <Helmet>
        <title>Customer Management Page</title>
      </Helmet>

      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="table-page">
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
            rows={customerList.current || []}
            columns={COLUMN_CONFIG}
            pageSize={pageSize}
            onPageSizeChange={changePageSize}
            rowsPerPageOptions={ROW_PAGE_OPTIONS}
            disableColumnMenu
            rowHeight={60}
            autoHeight
            hideFooterSelectedRowCount
            components={{ Row: CustomRow }}
          />
        </div>

        <CustomerDialog />
      </Container>
    </>
  );
}

export default CustomerManagement;
