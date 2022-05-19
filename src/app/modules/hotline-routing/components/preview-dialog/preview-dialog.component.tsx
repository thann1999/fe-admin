import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { DataGrid } from '@mui/x-data-grid';
import React, { useCallback, useState } from 'react';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import {
  COLUMN_CONFIG,
  DialogState,
  OpenDialogProps,
} from '../../shared/preview-dialog.const';
import './preview-dialog.style.scss';

function usePreviewDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    values: {
      id: 0,
      customerName: '',
      hotline: '',
      ipPort: '',
      status: '',
      trunkName: '',
    },
  });

  const openPreviewDialog = ({ title, values }: OpenDialogProps) => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: true,
      title,
      values,
    }));
  };

  const closePreviewDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const PreviewDialog = useCallback(() => {
    return (
      <Dialog
        open={dialogState.isOpen}
        className="preview-dialog"
        onClose={closePreviewDialog}
      >
        <CloseDialog onClose={closePreviewDialog} id="title">
          <Typography className="font--24b" textAlign="center">
            {dialogState.title}
          </Typography>
        </CloseDialog>

        <div className="data-grid">
          <DataGrid
            rows={[dialogState.values]}
            columns={COLUMN_CONFIG}
            autoHeight
            disableColumnMenu
            hideFooter
          />
        </div>
      </Dialog>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState]);

  return { PreviewDialog, openPreviewDialog, closePreviewDialog };
}

export default usePreviewDialog;
