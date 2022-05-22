import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import useTrunkDialog from '../components/trunk-dialog/trunk-dialog.component';
import { TrunkForm } from '../shared/trunk-dialog.const';

const rows = [
  {
    id: 1,
    name: 'Snow',
    telecom: 'Viettel',
    ip: '192.168.1.1',
    port: '3006',
  },
  {
    id: 2,
    telecom: 'Mobiphone',
    name: 'Lannister',
    ip: '192.168.1.2',
    port: '3008',
  },
  {
    id: 3,
    name: 'Thang',
    telecom: 'Vinaphone',
    ip: '192.168.1.1',
    port: '3009',
  },
  { id: 4, name: 'Stark', telecom: 'Fix', ip: '192.168.1.1', port: '3007' },
];

function TrunkManagement() {
  const { openTrunkDialog, TrunkDialog, closeTrunkDialog } = useTrunkDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'name', headerName: 'Tên Trunk', flex: 1 },
    { field: 'telecom', headerName: 'Nhà mạng', flex: 1 },
    {
      field: 'ipPort',
      headerName: 'IP:PORT',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.ip || ''}:${params.row.port}`,
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
            handleEdit={() => handleEdit(cellValues.row)}
            deleteDialogInfo={{
              title: 'Xóa Trunk?',
              type: 'error',
              description:
                'Bạn có thực sự muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
              handleConfirm: () => onDelete(cellValues.row),
            }}
          />
        );
      },
    },
  ]).current;

  const onDelete = (data: TrunkForm) => {
    // TODO: Call api delete
  };

  const onCreate = (data: TrunkForm) => {
    // TODO: Call api create
    console.log(data);
    closeTrunkDialog();
  };

  const onUpdate = (data: TrunkForm) => {
    // TODO: Call api update
    closeTrunkDialog();
  };

  const handleEdit = (initialValues: TrunkForm) => {
    openTrunkDialog({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhật Trunk',
      type: 'update',
    });
  };

  const handleCreateTrunk = () => {
    openTrunkDialog({
      onSubmit: onCreate,
      title: 'Tạo mới Trunk',
    });
  };

  return (
    <Container maxWidth="xl" className="table-page">
      <Helmet>
        <title>Trunk Management Page</title>
      </Helmet>

      <div className="create-button">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className="admin-button --no-transform"
          onClick={handleCreateTrunk}
        >
          Create
        </Button>
      </div>

      <div className="data-grid">
        <DataGrid
          rows={rows}
          columns={COLUMN_CONFIG}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          disableColumnMenu
          hideFooterSelectedRowCount
        />
      </div>

      <TrunkDialog />
    </Container>
  );
}

export default TrunkManagement;
