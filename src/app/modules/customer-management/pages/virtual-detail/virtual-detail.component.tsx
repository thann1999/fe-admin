import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomerAPI from 'app/api/customer.api';
import { getDifferenceTwoArray } from 'app/helpers/array.helper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { Message } from 'shared/const/message.const';
import useVirtualGroupDialog from '../../components/virtual-group-dialog/virtual-group-dialog.component';
import { VirtualGroupInfo } from '../../shared/customer.type';
import { GroupVirtualForm } from '../../shared/virtual-group-dialog.type';

function VirtualDetailPage() {
  const { customerId, virtualGroupId } = useParams();
  const virtualDetail = useRef<VirtualGroupInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const { VirtualGroupDialog, closeVirtualGroup, openVirtualGroup } =
    useVirtualGroupDialog();
  const navigate = useNavigate();

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

  const handleEdit = (initialValues: VirtualGroupInfo) => {
    openVirtualGroup({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhập nhóm Virtual',
      isUpdate: true,
    });
  };

  const onUpdate = async (data: GroupVirtualForm) => {
    const { vngName, virtual, status } = data;
    const callAPI = [];
    const customerId = virtualDetail.current?.customerId || 0;
    const vngId = virtualDetail.current?.vngId || 0;
    if (vngName !== virtualDetail.current?.vngName) {
      callAPI.push(() => {
        CustomerAPI.updateVirtualGroup({
          vngName,
          customerId,
          vngId,
        });
      });
    }
    if (status !== virtualDetail.current?.status) {
      callAPI.push(() => {
        CustomerAPI.updateVirtualGroup({
          status,
          customerId,
          vngId,
        });
      });
    }
    if (virtual?.length) {
      const arrayVirtual = virtual.map(
        (virtualItem) => virtualItem.label || virtualItem
      );
      const initialArrayVirtual =
        virtualDetail.current?.activeVirtual?.map((item) => item.isdn) || [];
      const deleteVirtual = getDifferenceTwoArray(
        initialArrayVirtual,
        arrayVirtual
      );
      const addVirtual = getDifferenceTwoArray(
        arrayVirtual,
        initialArrayVirtual
      );

      if (addVirtual.length) {
        const disableHotline = virtualDetail.current?.virtualNumbers.filter(
          (item) => !item.status
        );
        const addNewVirtual: string[] = [];
        addVirtual?.forEach((addItem) => {
          const findVirtual = disableHotline?.find(
            (item) => item.isdn === addItem
          );

          if (findVirtual) {
            callAPI.push(() => {
              CustomerAPI.changeActiveVirtual(String(findVirtual?.vnId), 1);
            });
            return;
          }
          addNewVirtual.push(addItem);
        });

        if (addNewVirtual.length) {
          callAPI.push(() => {
            CustomerAPI.updateVirtualGroup({
              customerId,
              vngId,
              isdns: addNewVirtual,
            });
          });
        }
      }

      if (deleteVirtual.length) {
        deleteVirtual.forEach((deleteItem) => {
          const findVirtual = virtualDetail.current?.activeVirtual?.find(
            (item) => item.isdn === deleteItem
          );
          if (findVirtual) {
            callAPI.push(() => {
              CustomerAPI.changeActiveVirtual(String(findVirtual?.vnId), 0);
            });
          }
        });
      }
    }

    try {
      if (callAPI.length) {
        setLoading(true);
        await Promise.all(callAPI.map((api) => api()));
        await getVirtualDetail();
        addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
      }
      closeVirtualGroup();
    } catch (error) {
      setLoading(false);
    }
  };

  const getVirtualDetail = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getVirtualDetail(
        customerId || '',
        virtualGroupId || ''
      );
      if (result) {
        const activeVirtual = result.virtualNumbers.filter(
          (item) => !!item.status
        );
        virtualDetail.current = {
          ...result,
          activeVirtual,
          id: 1,
          stringVirtual:
            activeVirtual?.map((item) => item.isdn).join(', ') || '',
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
        <Stack
          direction="row"
          alignItems="center"
          className="back mb--S"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosIcon />
          <Typography>Quay lại</Typography>
        </Stack>

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

      <VirtualGroupDialog />
    </>
  );
}

export default VirtualDetailPage;
