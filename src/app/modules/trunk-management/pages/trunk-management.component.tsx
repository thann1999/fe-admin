import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import useTrunkDialog from '../components/trunk-dialog/trunk-dialog.component';
import { TrunkForm } from '../shared/trunk-dialog.const';

const rows = [
  {
    id: 1,
    name: 'Snow',
    telecom: 1,
    ipPort: '192.168.1.1:3006',
  },
  {
    id: 2,
    name: 'Lannister',
    telecom: 2,
    ipPort: '192.168.1.1:3006',
  },
  {
    id: 3,
    name: 'Lannister',
    telecom: 3,
    ipPort: '192.168.1.1:3006',
  },
  { id: 4, name: 'Stark', telecom: 4, ipPort: '192.168.1.1:3006' },
];

function TrunkManagement() {
  const { openTrunkDialog, TrunkDialog, closeTrunkDialog } = useTrunkDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'No', flex: 0.5 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'telecom', headerName: 'Telecom', flex: 1.25 },
    {
      field: 'ipPort',
      headerName: 'IP:PORT',
      flex: 1.25,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (cellValues) => {
        const { name, telecom, ipPort, id } = cellValues.row;
        return (
          <CellAction
            viewAble={false}
            handleEdit={() =>
              handleEdit({
                name,
                ipPort,
                telecom,
                id,
              })
            }
            deleteDialogInfo={{
              title: 'Xóa Trunk?',
              type: 'error',
              description:
                'Bạn có thực sự muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
              handleConfirm: () => onDelete({ name, ipPort, telecom, id }),
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
      title: 'Update Trunk',
      type: 'update',
    });
  };

  const handleCreateTrunk = () => {
    openTrunkDialog({
      onSubmit: onCreate,
      title: 'Create New Trunk',
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
