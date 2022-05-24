import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import HotlineRoutingAPI from 'app/api/hotline-routing.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import usePreviewDialog from 'shared/blocks/preview-dialog/preview-dialog.component';
import useRoutingDialog from 'shared/blocks/routing-dialog/routing-dialog.component';
import { RoutingForm } from 'shared/blocks/routing-dialog/routing-dialog.type';
import { HotlineRoutingTableInfo } from '../shared/hotline-routing.const';

export const PREVIEW_CONFIG: GridColDef[] = [
  { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
  { field: 'trunkName', headerName: 'Tên Trunk', flex: 1 },
  { field: 'stringHotline', headerName: 'Hotline', flex: 1 },
  { field: 'ip', headerName: 'Đỉa chỉ IP', flex: 1 },
  { field: 'port', headerName: 'port', flex: 1 },
];

function HotlineRoutingPage() {
  const { RoutingDialog, closeRoutingDialog, openRoutingDialog } =
    useRoutingDialog({ isHotlineDialog: true });
  const { PreviewDialog, openPreviewDialog } = usePreviewDialog({
    columnConfig: PREVIEW_CONFIG,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const listData = useRef<HotlineRoutingTableInfo[]>();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
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
        return (
          <CellAction
            deleteAble={false}
            handleEdit={() => handleEdit(cellValues.row)}
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

  const handleViewInfo = (data: RoutingForm) => {
    openPreviewDialog({
      title: 'Thông tin chi tiết Hotline Trunk',
      values: data,
    });
  };

  const handleEdit = (initialValues: RoutingForm) => {
    openRoutingDialog({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhật Hotline Trunk',
      type: 'update',
    });
  };

  const handleCreateHotline = () => {
    openRoutingDialog({
      onSubmit: onCreate,
      title: 'Tạo mới Hotline Trunk',
      type: 'create',
    });
  };

  const getListHotline = useCallback(async () => {
    try {
      setLoading(true);
      const result = await HotlineRoutingAPI.getListHotlineRouting();
      if (result) {
        listData.current = result.hotlines.map((item) => ({
          id: item.customerId,
          customerId: item.customerId,
          customerName: item.customerName,
          ip: item.host,
          port: item.port,
          stringHotline: item.hotlines.join(','),
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
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            disableColumnMenu
            hideFooterSelectedRowCount
          />
        </div>

        <RoutingDialog />
        <PreviewDialog />
      </Container>
    </>
  );
}

export default HotlineRoutingPage;
