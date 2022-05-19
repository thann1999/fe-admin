import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import CreateTrunkDialogComponent from '../components/create-trunk-dialog/create-trunk-dialog.component';
import './trunk-management.style.scss';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'No', flex: 0.5 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'telecom', headerName: 'Telecom', flex: 1 },
  {
    field: 'ipPort',
    headerName: 'IP:PORT',
    flex: 1,
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1.5,
    sortable: false,
  },
];

const rows = [
  {
    id: 1,
    name: 'Snow',
    telecom: 'Viettel',
    ipPort: '192.168.1.1:3006',
    action: 35,
  },
  {
    id: 2,
    name: 'Lannister',
    telecom: 'Vinaphone',
    ipPort: '192.168.1.1:3006',
    age: 42,
  },
  {
    id: 3,
    name: 'Lannister',
    telecom: 'Mobiphone',
    ipPort: '192.168.1.1:3006',
    age: 45,
  },
  { id: 4, name: 'Stark', telecom: 'Fix', ipPort: '192.168.1.1:3006', age: 16 },
];

function TrunkManagement() {
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const handleCreateTrunk = (isOpen: boolean) => {
    setOpenCreate(isOpen);
  };

  return (
    <Container maxWidth="xl" className="trunk-management">
      <Helmet>
        <title>Trunk Management Page</title>
      </Helmet>

      <div className="create-button">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className="admin-button --no-transform"
          onClick={() => handleCreateTrunk(true)}
        >
          Create
        </Button>
      </div>

      <div className="data-grid">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          disableColumnMenu
          hideFooterSelectedRowCount
        />
      </div>

      <CreateTrunkDialogComponent
        open={openCreate}
        handleClose={() => handleCreateTrunk(false)}
      />
    </Container>
  );
}

export default TrunkManagement;
