import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { Preview, Edit, DeleteForever } from '@mui/icons-material';
import useConfirmDialog, {
  OpenDialogProps,
} from '../confirm-dialog/confirm-dialog.component';

interface ActionCellProps {
  viewAble?: boolean;
  editAble?: boolean;
  deleteAble?: boolean;
  handleView?: () => void;
  handleEdit?: () => void;
  deleteDialogInfo?: OpenDialogProps;
}

function ActionCell(props: ActionCellProps) {
  const {
    deleteAble,
    editAble,
    handleEdit,
    handleView,
    viewAble,
    deleteDialogInfo,
  } = props;

  const { ConfirmDialog, openConfirmDialog } = useConfirmDialog();

  const handleOpenDeleteConfirm = () => {
    if (deleteDialogInfo) {
      const { description, title, handleConfirm, type } = deleteDialogInfo;
      openConfirmDialog({
        title,
        type,
        description,
        handleConfirm,
      });
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {viewAble && (
        <IconButton onClick={handleView}>
          <Preview />
        </IconButton>
      )}

      {editAble && (
        <IconButton onClick={handleEdit}>
          <Edit sx={{ color: '#FF9D22', fontSize: '30px' }} />
        </IconButton>
      )}

      {deleteAble && (
        <IconButton color="error" onClick={handleOpenDeleteConfirm}>
          <DeleteForever sx={{ fontSize: '30px' }} />
        </IconButton>
      )}

      <ConfirmDialog />
    </Stack>
  );
}

ActionCell.defaultProps = {
  viewAble: true,
  editAble: true,
  deleteAble: true,
  handleView: () => {},
  handleEdit: () => {},
  deleteDialogInfo: {},
};

export default React.memo(ActionCell);
