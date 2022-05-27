import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import HotlineRoutingAPI from 'app/api/hotline-routing.api';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import { HotlineRoutingTableInfo } from '../shared/hotline-routing.const';

export const PREVIEW_CONFIG: GridColDef[] = [
  { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
  { field: 'trunkName', headerName: 'Tên Trunk', flex: 1 },
  { field: 'stringHotline', headerName: 'Hotline', flex: 1 },
  { field: 'ip', headerName: 'Đỉa chỉ IP', flex: 1 },
  { field: 'port', headerName: 'port', flex: 1 },
];

function HotlineRoutingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const listData = useRef<HotlineRoutingTableInfo[]>();
  const { changePageSize, pageSize } = useChangePageSize();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'no', headerName: 'STT', flex: 0.35 },
    { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
    { field: 'trunkName', headerName: 'Tên Trunk', flex: 1 },
    { field: 'stringHotline', headerName: 'Hotline', flex: 1 },
    { field: 'ip', headerName: 'Địa chỉ IP', flex: 1 },
    { field: 'port', headerName: 'Port', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => {
        return <CellAction />;
      },
    },
  ]).current;

  const handleCreateHotline = () => {};

  const getListHotline = useCallback(async () => {
    try {
      setLoading(true);
      const result = await HotlineRoutingAPI.getListHotlineRouting();
      if (result) {
        listData.current = result.hotlines.map((item, index) => ({
          id: item.customerId,
          customerId: item.customerId,
          customerName: item.customerName,
          ip: item.host,
          port: item.port,
          stringHotline: item.hotlines.join(', '),
          no: index + 1,
        }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListHotline();
  }, [getListHotline]);

  return (
    <>
      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="table-page">
        <Helmet>
          <title>Hotline Routing Page</title>
        </Helmet>

        <div className="create-button">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            className="admin-button --no-transform"
            onClick={handleCreateHotline}
          >
            Tạo mới
          </Button>
        </div>

        <div className="data-grid">
          <DataGrid
            rows={listData.current ? listData.current : []}
            columns={COLUMN_CONFIG}
            pageSize={pageSize}
            onPageSizeChange={changePageSize}
            rowsPerPageOptions={ROW_PAGE_OPTIONS}
            autoHeight
            disableColumnMenu
            hideFooterSelectedRowCount
            components={{ Row: CustomRow }}
          />
        </div>
      </Container>
    </>
  );
}

export default HotlineRoutingPage;
