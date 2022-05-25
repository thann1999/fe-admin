import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomerAPI, { VirtualNumber } from 'app/api/customer.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { Message } from 'shared/const/message.const';
import useCustomerDialog from '../../components/customer-dialog/customer-dialog.component';
import './customer-detail.style.scss';

export interface CustomerInfo {
  id: number;
  customerId: number;
  customerName: string;
  virtual: VirtualNumber[];
  hotline: string;
  description: string;
  stringVirtual: string;
}

function CustomerDetail() {
  const { openCustomerDialog, CustomerDialog, closeCustomerDialog } =
    useCustomerDialog();
  const { id } = useParams();
  const customerDetail = useRef<CustomerInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'hotline', headerName: 'Số Hotline', flex: 1 },
    {
      field: 'stringVirtual',
      headerName: 'Số Virtual',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Chức năng',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => (
        <CellAction
          viewAble={false}
          deleteAble={false}
          handleEdit={() => handleEdit(cellValues.row)}
        />
      ),
    },
  ]).current;

  const handleEdit = (initialValues: CustomerInfo) => {
    openCustomerDialog({
      initialValues,
      title: 'Cập nhật Khách hàng',
      onCallAPIUpdate,
      isUpdate: true,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCallAPIUpdate = async (callAPI: any[]) => {
    try {
      setLoading(true);
      await Promise.all(callAPI);
      await getCustomerDetail();
      addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
      closeCustomerDialog();
    } catch (error) {
      setLoading(false);
    }
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
          description: customerVIps[0]?.description,
          hotline: hotlines[0]?.hotlines?.join(','),
          virtual: customerVIps[0]?.customerVIps,
          stringVirtual: customerVIps[0]?.customerVIps
            ?.map((item: VirtualNumber) => item.virtualNumber)
            .join(','),
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
