import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import TrunkAPI, { TrunkInfo } from 'app/api/trunk.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import useTrunkDialog from '../components/trunk-dialog/trunk-dialog.component';
import { TrunkForm } from '../shared/trunk-dialog.const';

function TrunkManagement() {
  const { openTrunkDialog, TrunkDialog, closeTrunkDialog } = useTrunkDialog();
  const [loading, setLoading] = useState<boolean>(false);
  const listTrunk = useRef<TrunkInfo[]>();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'trunkName', headerName: 'Tên Trunk', flex: 1 },
    { field: 'groupName', headerName: 'Nhà mạng', flex: 1 },
    {
      field: 'ipPort',
      headerName: 'IP:PORT',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.ip || ''}:${params.row.port}`,
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
      headerName: 'Chức năng',
      flex: 1.5,
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <CellAction
            viewAble={false}
            deleteAble={false}
            handleEdit={() => handleEdit(cellValues.row)}
          />
        );
      },
    },
  ]).current;

  const onCreate = async (data: TrunkForm) => {
    try {
      const { ip, trunkName, port, telecom } = data;
      setLoading(true);
      await TrunkAPI.createNewTrunk({
        ip,
        port,
        trunkName,
        groupName: telecom,
      });

      await getListTrunk();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
      closeTrunkDialog();
    } catch (error) {
      setLoading(false);
    }
  };

  const onUpdate = async (data: TrunkForm, isOnlyChangeStatus?: boolean) => {
    try {
      const { id, telecom, ip, port, trunkName, status } = data;
      setLoading(true);
      await TrunkAPI.updateTrunk(
        isOnlyChangeStatus
          ? {
              groupCode: telecom,
              status: status ?? 0,
              trunkId: id || '',
            }
          : {
              groupCode: telecom,
              ip,
              port,
              status: status ?? 0,
              trunkId: id || '',
              trunkName,
            }
      );

      await getListTrunk();
      addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
      closeTrunkDialog();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEdit = (initialValues: TrunkInfo) => {
    openTrunkDialog({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhật Trunk',
      isUpdate: true,
    });
  };

  const handleCreateTrunk = () => {
    openTrunkDialog({
      title: 'Tạo mới Trunk',
      onSubmit: onCreate,
    });
  };

  const getListTrunk = useCallback(async () => {
    try {
      setLoading(true);
      const result = await TrunkAPI.getListTrunk();
      if (result) {
        listTrunk.current = result.groupIps;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListTrunk();
  }, [getListTrunk]);

  return (
    <>
      <Helmet>
        <title>Trunk Management Page</title>
      </Helmet>

      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="table-page">
        <div className="create-button">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            className="admin-button --no-transform"
            onClick={handleCreateTrunk}
          >
            Tạo mới
          </Button>
        </div>

        <div className="data-grid">
          <DataGrid
            rows={listTrunk.current || []}
            columns={COLUMN_CONFIG}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            disableColumnMenu
            rowHeight={60}
            hideFooterSelectedRowCount
          />
        </div>

        <TrunkDialog />
      </Container>
    </>
  );
}

export default TrunkManagement;
