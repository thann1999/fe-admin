import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomerAPI from 'app/api/customer.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import useCustomerDialog from '../../components/customer-dialog/customer-dialog.component';
import { CustomerForm } from '../../shared/customer-dialog.type';
import './customer-detail.style.scss';

interface CustomerInfo {
  id: number | string;
  customerId: number | string;
  customerName: string;
  status: number;
  virtual: string;
  hotline: string;
}

function CustomerDetail() {
  const { openCustomerDialog, CustomerDialog, closeCustomerDialog } =
    useCustomerDialog();
  const { id } = useParams();
  const customerDetail = useRef<CustomerInfo>();
  const [loading, setLoading] = useState<boolean>(false);

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
    console.log(data);
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

  const getCustomerDetail = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getDetailCustomer(id || '');
      if (result) {
        const { customerVIps, hotlines } = result;
        customerDetail.current = {
          id: customerVIps[0]?.customerId || hotlines[0]?.customerId,
          customerId: customerVIps[0]?.customerId || hotlines[0]?.customerId,
          customerName:
            customerVIps[0]?.customerName || hotlines[0].customerName,
          status: customerVIps[0]?.status,
          hotline: hotlines[0]?.hotlines?.join(';'),
          virtual: customerVIps[0]?.customerVIps?.join(';'),
        };
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getCustomerDetail();
  }, [getCustomerDetail]);

  return (
    <>
      <Helmet>
        <title>Customer Detail Page</title>
      </Helmet>

      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="customer-detail">
        <div className="data-grid">
          <DataGrid
            rows={customerDetail.current ? [customerDetail.current] : []}
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
    </>
  );
}

export default CustomerDetail;
