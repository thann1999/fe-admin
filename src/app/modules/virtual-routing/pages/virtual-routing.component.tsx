import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import VirtualRoutingAPI, { VirtualRouting } from 'app/api/virtual-routing.api';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import useVirtualRoutingDialog from '../components/virtual-routing-dialog/virtual-routing-dialog.component';
import { RoutingForm } from '../shared/virtual-routing-dialog.type';
import { VirtualRoutingTableInfo } from '../shared/virtual-routing.type';

function HotlineRoutingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const listDataHaveTrunk = useRef<VirtualRoutingTableInfo[]>([]);
  const listDataNotTrunk = useRef<VirtualRouting[]>([]);
  const { changePageSize, pageSize } = useChangePageSize();
  const { VirtualRoutingDialog, closeVirtualRouting, openVirtualRouting } =
    useVirtualRoutingDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'STT', flex: 0.3 },
    { field: 'customerName', headerName: 'Tên khách hàng', flex: 0.7 },
    {
      field: 'vngName',
      headerName: 'Tên nhóm Virtual',
      flex: 1,
      renderCell: (cellValues) => {
        const { customerId, vngId } = cellValues.row as VirtualRoutingTableInfo;

        return (
          <Link
            href={`/admin/customer-management/virtual-detail/${customerId}/${vngId}`}
            underline="none"
            className="ellipsis-text"
          >
            {cellValues.row.vngName}
          </Link>
        );
      },
    },
    {
      field: 'trunkName',
      headerName: 'Tên Trunk',
      flex: 1.5,
      renderCell: (cellValues) => {
        const { vngTrunks } = cellValues.row as VirtualRoutingTableInfo;
        return (
          <>
            {vngTrunks.map((item, index) => (
              <Link
                key={item.trunkId}
                href={`/admin/trunk-management/detail/${item.groupCode}/${item.trunkId}`}
                underline="none"
                className="ellipsis-text mr--XXS"
              >
                {item.trunkName}
                {index !== vngTrunks.length - 1 && ','}
              </Link>
            ))}
          </>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.5,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.status)?.label,
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

  const handleEditHotlineRouting = (initialValues: VirtualRouting) => {
    openVirtualRouting({
      onSubmit: onUpdate,
      initialValues,
      title: 'Cập nhật Trunk cho nhóm Virtual',
      isUpdate: true,
    });
  };

  const handleCreateHotlineRouting = () => {
    openVirtualRouting({
      onSubmit: onCreate,
      title: 'Tạo Trunk cho nhóm Virtual',
      listCustomerGroup: listDataNotTrunk.current,
    });
  };

  const onUpdate = async (data: RoutingForm) => {
    // try {
    //   setLoading(true);
    //   const { customerId, hotlineGroupId, trunkId, status } = data;
    //   const findData = listDataHaveTrunk.current.find(
    //     (item) => String(item.hotlineGroupId) === hotlineGroupId
    //   );
    //   const callAPI = [];
    //   if (findData?.trunkId !== Number(trunkId)) {
    //     callAPI.push(() => {
    //       HotlineRoutingAPI.setTrunkToGroupHotline({
    //         customerId,
    //         hotlineGroupId,
    //         trunkId,
    //       });
    //     });
    //   }
    //   if (status !== findData?.groupStatus) {
    //     callAPI.push(() => {
    //       CustomerAPI.updateHotlineGroup({
    //         customerId: Number(customerId),
    //         hotlineGroupId: Number(hotlineGroupId),
    //         status,
    //       });
    //     });
    //   }
    //   await Promise.all(callAPI.map((item) => item()));
    //   await getListHotline();
    //   addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
    //   closeHotlineRouting();
    // } catch (error) {
    //   setLoading(false);
    // }
  };

  const onCreate = async (data: RoutingForm) => {
    // try {
    //   setLoading(true);
    //   const { customerId, hotlineGroupId, trunkId } = data;
    //   await VirtualRoutingAPI.setTrunkToGroupVirtual({
    //     customerId,
    //     hotlineGroupId,
    //     trunkId,
    //   });
    //   await getListVirtual();
    //   addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
    //   closeHotlineRouting();
    // } catch (error) {
    //   setLoading(false);
    // }
  };

  const getListVirtual = useCallback(async () => {
    try {
      setLoading(true);
      const result = await VirtualRoutingAPI.getListVirtualRouting();

      if (result) {
        const dataHaveTrunk: VirtualRoutingTableInfo[] = [];
        const dataNotTrunk: VirtualRouting[] = [];
        result.virtualNumberGroups.forEach((item, index) => {
          if (item.vngTrunks?.length) {
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
    getListVirtual();
  }, [getListVirtual]);

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

      <VirtualRoutingDialog />
    </>
  );
}

export default HotlineRoutingPage;
