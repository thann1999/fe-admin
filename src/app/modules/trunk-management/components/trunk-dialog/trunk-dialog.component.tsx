import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import clsx from 'clsx';
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
    title: '',
    type: 'create',
    onSubmit: () => {},
  });
  const schema = useRef(
    yup.object().shape({
      name: yup.string().required('Vui lòng nhập tên Trunk'),
      ip: yup.string().required('Vui lòng nhập địa chỉ IP'),
      port: yup.string().required('Vui lòng nhập Port'),
      telecom: yup.string().required('Vui lòng nhập Nhà mạng'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<TrunkForm>({
    defaultValues: {
      name: '',
      ip: '',
      port: '',
      telecom: '',
    },
    resolver: yupResolver(schema),
  });

  const openTrunkDialog = ({
    title,
    type = 'create',
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { ip, name, telecom, port } = initialValues;
      setValue('name', name);
      setValue('ip', ip);
      setValue('port', port);
      setValue(
        'telecom',
        TELECOM_OPTIONS.find((item) => item.label === telecom)?.value || ''
      );
    }
    setDialogState((prev) => ({
      ...prev,
      isOpen: true,
      title,
      type,
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
            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XS require-field">
                  Tên Trunk
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="name"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập tên Trunk"
                />
              </Grid>
            </div>

            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XS require-field">
                  Nhà mạng
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

            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XS require-field">
                  Địa chỉ IP
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="ip"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập địa chỉ IP"
                />
              </Grid>
            </div>

            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XS require-field">
                  Port
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="port"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập Port"
                />
              </Grid>
            </div>

            <Button
              variant="contained"
              type="submit"
              className={clsx('action-button --no-transform width-100', {
                '--update': dialogState.type === 'update',
              })}
            >
              {dialogState.type === 'create' ? 'Tạo Trunk' : 'Cập nhật'}
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
