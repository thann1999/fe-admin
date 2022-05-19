import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import {
  CustomerForm,
  DialogState,
  OpenDialogProps,
} from '../../shared/customer-dialog.type';
import './customer-dialog.style.scss';

function useCustomerDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    type: 'create',
    onSubmit: () => {},
  });
  const schema = useRef(
    yup.object().shape({
      name: yup.string().required('Vui lòng nhập Tên khách hàng'),
      hotline: yup.string().required('Vui lòng nhập số Hotline'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<CustomerForm>({
    defaultValues: {
      name: '',
      hotline: '',
    },
    resolver: yupResolver(schema),
  });

  const openCustomerDialog = ({
    title,
    type,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { name, hotline } = initialValues;
      setValue('name', name);
      setValue('hotline', hotline);
    }
    setDialogState((prev) => ({
      ...prev,
      isOpen: true,
      title,
      type,
      onSubmit,
    }));
  };

  const closeCustomerDialog = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const TrunkDialog = useCallback(() => {
    return (
      <Dialog
        open={dialogState.isOpen}
        className="customer-dialog"
        onClose={closeCustomerDialog}
      >
        <CloseDialog onClose={closeCustomerDialog} id="title">
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
                <Typography className="mt--S mb--XXS require-field">
                  Tên khách hàng
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="name"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập tên Khách hàng"
                />
              </Grid>
            </div>

            <div id="hotline">
              <Grid item xs={12}>
                <Typography className="mt--S mb--XXS require-field">
                  Hotline
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="hotline"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập số Hotline"
                />
              </Grid>
            </div>

            <Button
              variant="contained"
              type="submit"
              className="action-button --no-transform width-100 "
            >
              {dialogState.type === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          </form>
        </Grid>
      </Dialog>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState]);

  return { TrunkDialog, openCustomerDialog, closeCustomerDialog };
}

export default useCustomerDialog;
