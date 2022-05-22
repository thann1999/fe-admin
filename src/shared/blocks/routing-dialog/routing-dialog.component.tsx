import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import AutocompleteController from 'shared/form/autocomplete/autocomplete-controller.component';
import SelectController from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import { convertHotline } from './routing-dialog.helper';
import './routing-dialog.style.scss';
import {
  DialogState,
  OpenDialogProps,
  RoutingDialogProps,
  RoutingForm,
  STATUS_OPTIONS,
  TRUNK_NAME_OPTIONS,
} from './routing-dialog.type';

function useRoutingDialog({ isHotlineDialog }: RoutingDialogProps) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    type: 'create',
    onSubmit: () => {},
    hotlineOptions: [],
  });
  const schema = useRef(
    yup.object().shape({
      customerName: yup.string().required('Vui lòng nhập Tên khách hàng'),
      // hotline: isHotlineDialog
      //   ? yup.array().required('Vui lòng nhập số Hotline')
      //   : yup.array(),
      trunkName: yup.string().required('Vui lòng chọn Tên Trunk'),
      ipPort: yup.string().required('Vui lòng nhập IP:Port'),
      status: yup.string().required('Vui lòng chọn Trạng thái'),
      virtual: isHotlineDialog
        ? yup.string()
        : yup.string().required('Vui lòng nhập số số Virtual'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<RoutingForm>({
    defaultValues: {
      customerName: '',
      ipPort: '',
      trunkName: '',
      status: '',
      virtual: '',
      stringHotline: '',
      hotline: [],
    },
    resolver: yupResolver(schema),
  });

  const openRoutingDialog = ({
    title,
    type,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const {
        customerName,
        stringHotline,
        ipPort,
        trunkName,
        status,
        virtual,
      } = initialValues;
      const hotlineOptions = stringHotline ? convertHotline(stringHotline) : [];
      setValue('customerName', customerName);
      // setValue('hotline', hotlineOptions);
      setValue('ipPort', ipPort);
      setValue('trunkName', trunkName);
      setValue('status', status);
      setValue('virtual', virtual);
      setDialogState((prev) => ({ ...prev, hotlineOptions }));
    }
    setDialogState((prev) => ({
      ...prev,
      isOpen: true,
      title,
      type,
      onSubmit,
    }));
  };

  const closeRoutingDialog = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const RoutingDialog = useCallback(() => {
    return (
      <Dialog
        open={dialogState.isOpen}
        className="customer-dialog"
        onClose={closeRoutingDialog}
      >
        <CloseDialog onClose={closeRoutingDialog} id="title">
          <Typography className="font--24b" textAlign="center">
            {dialogState.title}
          </Typography>
        </CloseDialog>

        <Grid>
          <form
            className="form-paper"
            onSubmit={handleSubmit(dialogState.onSubmit)}
          >
            <div id="customerName">
              <Grid item xs={12}>
                <Typography className="mt--S mb--XXS require-field">
                  Tên khách hàng
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="customerName"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập tên Khách hàng"
                />
              </Grid>
            </div>

            <div id="trunkName">
              <Grid item xs={12}>
                <Typography className="mt--S mb--XXS require-field">
                  Tên Trunk
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <SelectController
                  name="trunkName"
                  control={control}
                  className="admin-select width-100"
                  options={TRUNK_NAME_OPTIONS}
                />
              </Grid>
            </div>

            {isHotlineDialog ? (
              <div>
                <Grid item xs={12}>
                  <Typography className="mt--S mb--XXS require-field">
                    Số Hotline
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <AutocompleteController
                    multiple
                    name="hotline"
                    control={control}
                    options={dialogState.hotlineOptions}
                    defaultValue={dialogState.hotlineOptions}
                    placeholder="Nhập Hotline"
                  />
                </Grid>
              </div>
            ) : (
              <div id="virtual">
                <Grid item xs={12}>
                  <Typography className="mt--S mb--XXS require-field">
                    Virtual
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="virtual"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập số Virtual"
                  />
                </Grid>
              </div>
            )}

            <div id="ipPort">
              <Grid item xs={12}>
                <Typography className="mt--S mb--XXS require-field">
                  IP:PORT
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="ipPort"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập thông tin IP:PORT"
                />
              </Grid>
            </div>

            <div id="status">
              <Grid item xs={12}>
                <Typography className="mt--S mb--XXS require-field">
                  Trạng thái
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <SelectController
                  name="status"
                  control={control}
                  className="admin-select width-100"
                  options={STATUS_OPTIONS}
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
              {dialogState.type === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          </form>
        </Grid>
      </Dialog>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState]);

  return { RoutingDialog, openRoutingDialog, closeRoutingDialog };
}

export default useRoutingDialog;
