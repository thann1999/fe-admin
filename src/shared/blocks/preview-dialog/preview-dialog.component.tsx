import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useCallback, useState } from 'react';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import './preview-dialog.style.scss';
import { RoutingForm } from 'shared/blocks/routing-dialog/routing-dialog.type';

export interface OpenDialogProps {
  title: string;
  values: RoutingForm;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
}

interface PreviewDialogProps {
  columnConfig: GridColDef[];
}

function usePreviewDialog({ columnConfig }: PreviewDialogProps) {
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
      virtual: '',
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
            columns={columnConfig}
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
