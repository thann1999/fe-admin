import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { convertHotlineVirtual } from 'app/helpers/array-convert.helper';
import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import AutocompleteController from 'shared/form/autocomplete/autocomplete-controller.component';
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
    isUpdate: false,
    hotlineOptions: [],
    virtualOptions: [],
    onSubmit: () => {},
  });
  const schema = useRef(
    yup.object().shape(
      {
        name: yup.string().required('Vui lòng nhập Tên khách hàng'),
        hotline: dialogState.isUpdate
          ? yup.string()
          : yup.string().when('virtual', {
              is: (value: string) => !value,
              then: yup.string().required('Vui lòng nhập số Hotline'),
            }),
        virtual: dialogState.isUpdate
          ? yup.string()
          : yup.string().when('hotline', {
              is: (value: string) => !value,
              then: yup.string().required('Vui lòng nhập số Virtual'),
            }),
        description: dialogState.isUpdate
          ? yup.string()
          : yup.string().required('Vui lòng nhập Mô tả'),
      },
      [['virtual', 'hotline']]
    )
  ).current;
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CustomerForm>({
      defaultValues: {
        name: '',
        hotline: '',
        virtual: '',
        description: '',
        editHotline: [],
        editVirtual: [],
        id: 1,
      },
      resolver: yupResolver(schema),
    });

  const openCustomerDialog = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { name, hotline, description, virtual } = initialValues;
      const hotlineOptions = hotline ? convertHotlineVirtual(hotline) : [];
      const virtualOptions = virtual ? convertHotlineVirtual(virtual) : [];
      setValue('name', name);
      setValue('description', description);
      setValue('hotline', hotline);
      setValue('virtual', virtual);
      setDialogState((prev) => ({ ...prev, hotlineOptions, virtualOptions }));
    }
    setDialogState((prev) => ({
      ...prev,
      title,
      isUpdate,
      onSubmit,
      isOpen: true,
    }));
  };

  const closeCustomerDialog = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const CustomerDialog = useCallback(() => {
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
            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XXS require-field">
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

            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XXS require-field">
                  Mô tả
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="description"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập Mô tả"
                />
              </Grid>
            </div>

            {dialogState.isUpdate ? (
              <>
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS require-field">
                      Số Hotline
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <AutocompleteController
                      multiple
                      freeSolo
                      options={dialogState.hotlineOptions}
                      defaultValue={dialogState.hotlineOptions}
                      name="editHotline"
                      control={control}
                      placeholder="Nhập số Hotline"
                    />
                  </Grid>
                </div>

                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS require-field">
                      Số Virtual
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <AutocompleteController
                      multiple
                      freeSolo
                      options={dialogState.virtualOptions}
                      defaultValue={dialogState.virtualOptions}
                      name="editVirtual"
                      control={control}
                      placeholder="Nhập số Virtual"
                    />
                  </Grid>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Grid item xs={12}>
                    <Typography
                      className={clsx('mt--XS mb--XXS', {
                        'require-field': !watch('virtual'),
                      })}
                    >
                      Số Hotline
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="hotline"
                      control={control}
                      disabled={!!watch('virtual')}
                      className="admin-text-field width-100"
                      placeholder="Nhập số Hotline"
                    />
                  </Grid>
                </div>

                <div>
                  <Grid item xs={12}>
                    <Typography
                      className={clsx('mt--XS mb--XXS ', {
                        'require-field': !watch('hotline'),
                      })}
                    >
                      Số Virtual
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="virtual"
                      control={control}
                      disabled={!!watch('hotline')}
                      className="admin-text-field width-100"
                      placeholder="Nhập số Virtual"
                    />
                  </Grid>
                </div>
              </>
            )}

            <Button
              variant="contained"
              type="submit"
              className={clsx('action-button --no-transform width-100', {
                '--update': dialogState.isUpdate,
              })}
            >
              {dialogState.isUpdate ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </form>
        </Grid>
      </Dialog>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState]);

  return { CustomerDialog, openCustomerDialog, closeCustomerDialog };
}

export default useCustomerDialog;
