import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import SelectController from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import {
  DialogState,
  OpenDialogProps,
  TELECOM_OPTIONS,
  TrunkForm,
} from '../../shared/trunk-dialog.const';
import './trunk-dialog.style.scss';

function useTrunkDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    nameButton: '',
    title: '',
    type: 'create',
    onSubmit: () => {},
  });
  const schema = useRef(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      ipPort: yup.string().required('IP:Port is required'),
      telecom: yup.string().required('Telecom is required'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<TrunkForm>({
    defaultValues: {
      name: '',
      ipPort: '',
      telecom: '',
    },
    resolver: yupResolver(schema),
  });

  const openTrunkDialog = ({
    title,
    type = 'create',
    nameButton,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { ipPort, name, telecom } = initialValues;
      setValue('name', name);
      setValue('ipPort', ipPort);
      setValue('telecom', telecom);
    }
    setDialogState((prev) => ({
      ...prev,
      isOpen: true,
      title,
      type,
      nameButton,
      onSubmit,
    }));
  };

  const closeTrunkDialog = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const TrunkDialog = useCallback(() => {
    return (
      <Dialog
        open={dialogState.isOpen}
        className="trunk-dialog"
        onClose={closeTrunkDialog}
      >
        <CloseDialog onClose={closeTrunkDialog} id="title">
          <Typography className="font--24b" textAlign="center">
            {dialogState.title}
          </Typography>
        </CloseDialog>

        <Grid>
          <form
            className="form-paper"
            onSubmit={handleSubmit(dialogState.onSubmit)}
          >
            <div id="name">
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XS require-field">
                  Trunk name
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="name"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Name"
                />
              </Grid>
            </div>

            <div id="telecom">
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XS require-field">
                  Telecom
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <SelectController
                  name="telecom"
                  control={control}
                  className="admin-select width-100"
                  options={TELECOM_OPTIONS}
                />
              </Grid>
            </div>

            <div id="ipPort">
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XS require-field">
                  IP:Port
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="ipPort"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="IP:Port"
                />
              </Grid>
            </div>

            <Button
              variant="contained"
              type="submit"
              className="action-button --no-transform width-100 "
            >
              {dialogState.nameButton}
            </Button>
          </form>
        </Grid>
      </Dialog>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState]);

  return { TrunkDialog, openTrunkDialog, closeTrunkDialog };
}

export default useTrunkDialog;
