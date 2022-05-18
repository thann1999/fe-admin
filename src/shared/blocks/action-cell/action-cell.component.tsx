import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { Preview, Edit, Delete } from '@mui/icons-material';

interface ActionCellProps {
  viewAble?: boolean;
  editAble?: boolean;
  deleteAble?: boolean;
  handleView?: () => void;
  handleDelete?: () => void;
  handleEdit?: () => void;
}

function ActionCell(props: ActionCellProps) {
  const {
    deleteAble,
    editAble,
    handleDelete,
    handleEdit,
    handleView,
    viewAble,
  } = props;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {viewAble && (
        <IconButton disableRipple>
          <Preview />
        </IconButton>
      )}

      {editAble && (
        <IconButton disableRipple>
          <Edit />
        </IconButton>
      )}

      {deleteAble && (
        <IconButton disableRipple>
          <Delete />
        </IconButton>
      )}
    </Stack>
  );
}

ActionCell.defaultProps = {
  viewAble: false,
  editAble: false,
  deleteAble: false,
  handleView: () => {
    // Do nothing
  },
  handleDelete: () => {
    // Do nothing
  },
  handleEdit: () => {
    // Do nothing
  },
};

export default React.memo(ActionCell);
