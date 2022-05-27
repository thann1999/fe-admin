import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomerAPI, { VirtualNumberGroup } from 'app/api/customer.api';
// import CustomerAPI, { VirtualNumber } from 'app/api/customer.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { VirtualGroupInfo } from '../../shared/type/customer.type';
import '../../shared/styles/detail-page.style.scss';

function VirtualDetailPage() {
  const { customerId, virtualGroupId } = useParams();
  const virtualDetail = useRef<VirtualGroupInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'STT', flex: 0.3 },
    { field: 'vngName', headerName: 'Tên nhóm Virtual', flex: 1 },
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

  const handleEdit = (initialValues: VirtualNumberGroup) => {};

  const getVirtualDetail = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getVirtualDetail(
        customerId || '',
        virtualGroupId || ''
      );
      if (result) {
        virtualDetail.current = {
          ...result,
          id: 1,
          stringVirtual:
            result?.virtualNumbers.map((item) => item.isdn).join(', ') || '',
        };
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getVirtualDetail();
  }, [getVirtualDetail]);

  return (
    <>
      <Helmet>
        <title>Virtual Number Detail Page</title>
      </Helmet>

      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="detail-page">
        <div className="data-grid">
          <DataGrid
            rows={virtualDetail.current ? [virtualDetail.current] : []}
            columns={COLUMN_CONFIG}
            rowHeight={200}
            autoHeight
            disableColumnMenu
            hideFooter
          />
        </div>
      </Container>
    </>
  );
}

export default VirtualDetailPage;
