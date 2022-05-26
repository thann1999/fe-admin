import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import CustomerAPI, { VirtualNumber } from 'app/api/customer.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import './customer-detail.style.scss';

export interface CustomerInfo {
  id: number;
  customerId: number;
  customerName: string;
  // virtual: VirtualNumber[];
  hotline: string;
  description: string;
  stringVirtual: string;
}

function CustomerDetail() {
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

  const handleEdit = (initialValues: CustomerInfo) => {};

  const getCustomerDetail = useCallback(async () => {}, []);

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
      </Container>
    </>
  );
}

export default CustomerDetail;
