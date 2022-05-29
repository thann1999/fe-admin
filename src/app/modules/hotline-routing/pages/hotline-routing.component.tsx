import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomerAPI from 'app/api/customer.api';
import HotlineRoutingAPI, { HotlineRouting } from 'app/api/hotline-routing.api';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import useHotlineRoutingDialog from 'shared/blocks/routing-dialog/routing-dialog.component';
import { RoutingForm } from 'shared/blocks/routing-dialog/routing-dialog.type';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import { HotlineRoutingTableInfo } from '../shared/hotline-routing.const';

function HotlineRoutingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const listDataHaveTrunk = useRef<HotlineRoutingTableInfo[]>([]);
  const listDataNotTrunk = useRef<HotlineRouting[]>([]);
  const { changePageSize, pageSize } = useChangePageSize();
  const { HotlineRoutingDialog, closeHotlineRouting, openHotlineRouting } =
    useHotlineRoutingDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'STT', flex: 0.5 },
    { field: 'customerName', headerName: 'Tên khách hàng', flex: 1 },
    {
      field: 'hotlineGroupName',
      headerName: 'Tên nhóm Hotline',
      flex: 1,
      renderCell: (cellValues) => {
        const { customerId, hotlineGroupId } = cellValues.row;

        return (
          <Link
            href={`/admin/customer-management/hotline-detail/${customerId}/${hotlineGroupId}`}
            underline="none"
          >
            {cellValues.row.hotlineGroupName}
          </Link>
        );
      },
    },
    {
      field: 'trunkName',
      headerName: 'Tên Trunk',
      flex: 1,
      renderCell: (cellValues) => {
        const { groupCode, trunkId } = cellValues.row;
        return (
          <Link
            href={`/admin/trunk-management/detail/${groupCode}/${trunkId}`}
            underline="none"
          >
            {cellValues.row.trunkName}
          </Link>
        );
      },
    },
    {
      field: 'groupStatus',
      headerName: 'Trạng thái',
      flex: 0.5,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.groupStatus)
          ?.label,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <CellAction
            viewAble={false}
            deleteAble={false}
            handleEdit={() => handleEditHotlineRouting(cellValues.row)}
          />
        );
      },
    },
  ]).current;

  const handleEditHotlineRouting = (initialValues: HotlineRouting) => {
    openHotlineRouting({
      onSubmit: onUpdate,
      initialValues,
      title: 'Cập nhật Trunk cho nhóm Hotline',
      isUpdate: true,
      listCustomerGroup: listDataHaveTrunk.current,
    });
  };

  const handleCreateHotlineRouting = () => {
    openHotlineRouting({
      onSubmit: onCreate,
      title: 'Tạo Trunk cho nhóm Hotline',
      listCustomerGroup: listDataNotTrunk.current,
    });
  };

  const onUpdate = async (data: RoutingForm) => {
    try {
      setLoading(true);
      const { customerId, hotlineGroupId, trunkId, status } = data;
      const findData = listDataHaveTrunk.current.find(
        (item) => String(item.hotlineGroupId) === hotlineGroupId
      );
      const callAPI = [];
      if (findData?.trunkId !== Number(trunkId)) {
        callAPI.push(() => {
          HotlineRoutingAPI.setTrunkToGroupHotline({
            customerId,
            hotlineGroupId,
            trunkId,
          });
        });
      }
      if (status !== findData?.groupStatus) {
        callAPI.push(() => {
          CustomerAPI.updateHotlineGroup({
            customerId: Number(customerId),
            hotlineGroupId: Number(hotlineGroupId),
            status,
          });
        });
      }

      await Promise.all(callAPI.map((item) => item()));
      await getListHotline();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
      closeHotlineRouting();
    } catch (error) {
      setLoading(false);
    }
  };

  const onCreate = async (data: RoutingForm) => {
    try {
      setLoading(true);
      const { customerId, hotlineGroupId, trunkId } = data;
      await HotlineRoutingAPI.setTrunkToGroupHotline({
        customerId,
        hotlineGroupId,
        trunkId,
      });
      await getListHotline();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
      closeHotlineRouting();
    } catch (error) {
      setLoading(false);
    }
  };

  const getListHotline = useCallback(async () => {
    try {
      setLoading(true);
      const result = await HotlineRoutingAPI.getListHotlineRouting();

      if (result) {
        const dataHaveTrunk: HotlineRoutingTableInfo[] = [];
        const dataNotTrunk: HotlineRouting[] = [];
        result.hotlineGroups.forEach((item, index) => {
          if (item.trunkId) {
            dataHaveTrunk.push({ ...item, id: index + 1 });
          } else {
            dataNotTrunk.push(item);
          }
        });
        listDataHaveTrunk.current = dataHaveTrunk;
        listDataNotTrunk.current = dataNotTrunk;
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
          <title>Định tuyến Hotline</title>
        </Helmet>

        <div className="create-button">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            className="admin-button --no-transform"
            onClick={handleCreateHotlineRouting}
          >
            Tạo mới
          </Button>
        </div>

        <div className="data-grid">
          <DataGrid
            rows={listDataHaveTrunk.current ? listDataHaveTrunk.current : []}
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

      <HotlineRoutingDialog />
    </>
  );
}

export default HotlineRoutingPage;
