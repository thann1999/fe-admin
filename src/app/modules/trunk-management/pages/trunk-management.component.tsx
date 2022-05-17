import React, { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Button, Container, TextField } from '@mui/material';
import './trunk-management.style.scss';
import CreateTrunkDialogComponent from '../components/create-trunk-dialog/create-trunk-dialog.component';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'No', flex: 0.5 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'lastName', headerName: 'Telecom', flex: 1 },
  {
    field: 'age',
    headerName: 'IP:PORT',
    flex: 1,
  },
  {
    field: 'action',
    headerName: 'Action',
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    flex: 1.5,
    sortable: false,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

function TrunkManagement() {
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const handleCreateTrunk = (isOpen: boolean) => {
    setOpenCreate(true);
  };

  return (
    <Container maxWidth="xl" className="trunk-management">
      <div className="create-button">
        <Button
          variant="contained"
          color="success"
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
        />
      </div>

      <CreateTrunkDialogComponent
        open={openCreate}
        handleClose={handleCreateTrunk}
      />
    </Container>
  );
}

export default TrunkManagement;
