import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CustomerAPI from 'app/api/customer.api';
import {
  convertStringToArray,
  convertStringToSelectItem,
  getDifferenceTwoArray,
} from 'app/helpers/array.helper';
import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import AutocompleteController from 'shared/form/autocomplete/autocomplete-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import { CustomerInfo } from '../../pages/customer-detail/customer-detail.component';
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
    onCallAPIUpdate: () => {},
  });
  const schema = useRef(
    yup.object().shape(
      {
        customerName: yup.string().required('Vui lòng nhập Tên khách hàng'),
        virtual: yup.string().when('hotline', {
          is: (value: string) => !value,
          then: yup.string().required('Vui lòng nhập số Virtual'),
        }),
        hotline: yup.string().when('virtual', {
          is: (value: string) => !value,
          then: yup.string().required('Vui lòng nhập số Hotline'),
        }),
        description: yup.string().required('Vui lòng nhập Mô tả'),
      },
      [['virtual', 'hotline']]
    )
  ).current;
  const customerInitialValues = useRef<CustomerInfo>();
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CustomerForm>({
      defaultValues: {
        customerName: '',
        hotline: '',
        virtual: '',
        description: '',
        editHotline: [],
        editVirtual: [],
        id: 0,
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
      const { customerName, hotline, stringVirtual, id } = initialValues;
      customerInitialValues.current = { ...initialValues };
      const hotlineOptions = convertStringToSelectItem(hotline);
      const virtualOptions = convertStringToSelectItem(stringVirtual);
      setValue('customerName', customerName);
      setValue('hotline', hotline);
      setValue('virtual', stringVirtual);
      setValue('id', id);
      setValue('editHotline', hotlineOptions);
      setValue('editVirtual', virtualOptions);
      schema.fields.hotline = yup.string();
      schema.fields.virtual = yup.string();
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

  const handleUpdate = async (data: CustomerForm) => {
    const requireAutocomplete =
      !watch('editHotline').length && !watch('editVirtual').length;
    if (requireAutocomplete) {
      return;
    }

    const { customerName, description, editHotline, editVirtual } = data;
    const callAPI = [];

    if (
      customerName !== customerInitialValues.current?.customerName ||
      description !== customerInitialValues.current?.description
    ) {
      callAPI.push(
        CustomerAPI.updateCustomer.bind({
          customerId: data.id,
          customerName,
          description,
        })
      );
    }

    // Convert SelectItem[], string to string[]
    const arrayHotline = editHotline.map((hotline) => hotline.value || hotline);
    const arrayVirtual = editVirtual.map((virtual) => virtual.value || virtual);
    const initialHotline = convertStringToArray(
      customerInitialValues.current?.hotline
    );
    const initialVirtual = convertStringToArray(
      customerInitialValues.current?.stringVirtual
    );

    // Get add, delete hotline and virtualNumber
    const deleteHotlines = getDifferenceTwoArray(initialHotline, arrayHotline);
    const addHotlines = getDifferenceTwoArray(arrayHotline, initialHotline);
    const deleteVirtual = getDifferenceTwoArray(initialVirtual, arrayVirtual);
    const addVirtual = getDifferenceTwoArray(arrayVirtual, initialVirtual);

    if (deleteHotlines.length) {
      deleteHotlines.forEach((item) => {
        callAPI.push(CustomerAPI.deleteHotline.bind(item));
      });
    }

    if (addHotlines.length) {
      callAPI.push(
        CustomerAPI.addHotline.bind({
          msisdn: addHotlines.join(','),
          customerId: data.id,
        })
      );
    }

    if (addVirtual.length) {
      callAPI.push(
        CustomerAPI.addVirtualNumber.bind({
          virtualNumber: addVirtual.join(','),
          customerId: data.id,
        })
      );
    }

    if (deleteVirtual.length) {
      deleteVirtual.forEach((virtual) => {
        const findVirtual = customerInitialValues.current?.virtual.find(
          (item) => item.virtualNumber === virtual
        );
        callAPI.push(
          CustomerAPI.deleteVirtualNumber.bind({
            customerId: data.id,
            virtualNumber: findVirtual?.virtualNumber || '',
            id: findVirtual?.id,
          })
        );
      });
    }

    if (dialogState.onCallAPIUpdate) {
      dialogState.onCallAPIUpdate(callAPI);
    }
  };

  const CustomerDialog = useCallback(() => {
    const requireAutocomplete =
      !watch('editHotline').length && !watch('editVirtual').length;

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
            onSubmit={handleSubmit(
              dialogState.onSubmit ? dialogState.onSubmit : handleUpdate
            )}
          >
            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XXS require-field">
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
                    <Typography
                      className={clsx('mt--XS mb--XXS', {
                        'require-field': !watch('editVirtual').length,
                      })}
                    >
                      Số Hotline
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <AutocompleteController
                      multiple
                      freeSolo
                      isError={requireAutocomplete}
                      options={dialogState.hotlineOptions}
                      defaultValue={dialogState.hotlineOptions}
                      name="editHotline"
                      disable={!!watch('editVirtual').length}
                      control={control}
                      placeholder="Nhập số Hotline"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormHelperText className="labelAsterisk">
                      {requireAutocomplete && 'Vui lòng nhập số Hotline'}
                    </FormHelperText>
                  </Grid>
                </div>

                <div>
                  <Grid item xs={12}>
                    <Typography
                      className={clsx('mt--XS mb--XXS', {
                        'require-field': !watch('editHotline').length,
                      })}
                    >
                      Số Virtual
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <AutocompleteController
                      multiple
                      freeSolo
                      isError={requireAutocomplete}
                      disable={!!watch('editHotline').length}
                      options={dialogState.virtualOptions}
                      defaultValue={dialogState.virtualOptions}
                      name="editVirtual"
                      control={control}
                      placeholder="Nhập số Virtual"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormHelperText className="labelAsterisk">
                      {requireAutocomplete && 'Vui lòng nhập số Virtual'}
                    </FormHelperText>
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
