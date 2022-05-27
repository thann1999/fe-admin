import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CustomerAPI, { Hotline } from 'app/api/customer.api';
import { convertArrayToSelectItem } from 'app/helpers/array.helper';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import AutocompleteController from 'shared/form/autocomplete/autocomplete-controller.component';
import SelectController, {
  SelectItem,
} from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import {
  DialogState,
  GroupHotlineForm,
  OpenDialogProps,
} from '../../shared/type/hotline-group-dialog.type';
import './hotline-group-dialog.style.scss';

function useHotlineGroupDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: false,
    onSubmit: () => {},
    hotlineOptions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const customerList = useRef<SelectItem[]>();
  const schema = useRef(
    yup.object().shape({
      customerId: yup.string(),
      groupHotlineName: yup.string().required('Vui lòng nhập tên nhóm Hotline'),
      stringHotline: yup.string(),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<GroupHotlineForm>({
    defaultValues: {
      customerId: '',
      stringHotline: '',
      groupHotlineName: '',
      hotline: [],
    },
    resolver: yupResolver(schema),
  });

  const openHotlineGroup = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const {
        customerId,
        hotlineGroupName,
        groupStatus,
        hotlines,
        customerName,
      } = initialValues;
      const hotlineOptions = convertArrayToSelectItem<Hotline>(
        hotlines,
        'isdn',
        'hotlineId'
      );
      setValue('customerId', customerId);
      setValue('hotline', hotlineOptions);
      setValue('customerName', customerName);
      setValue('groupHotlineName', hotlineGroupName);
      setValue('status', groupStatus);
      setDialogState((prev) => ({ ...prev, hotlineOptions }));
    } else {
      schema.fields.stringHotline = yup
        .string()
        .required('Vui lòng nhập số Hotline');
      schema.fields.customerId = yup
        .string()
        .required('Vui lòng chọn Khách hàng');
    }
    setDialogState((prev) => ({
      ...prev,
      title,
      isUpdate,
      onSubmit,
      isOpen: true,
    }));
  };

  const closeHotlineGroup = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleUpdate = async (data: GroupHotlineForm) => {
    // const requireAutocomplete =
    //   !watch('editHotline').length && !watch('editVirtual').length;
    // if (requireAutocomplete) {
    //   return;
    // }
    // const { customerName, description, editHotline, editVirtual } = data;
    // const callAPI = [];
    // if (
    //   customerName !== customerInitialValues.current?.customerName ||
    //   description !== customerInitialValues.current?.description
    // ) {
    //   callAPI.push(
    //     CustomerAPI.updateCustomer.bind({
    //       customerId: data.id,
    //       customerName,
    //       description,
    //     })
    //   );
    // }
    // // Convert SelectItem[], string to string[]
    // const arrayHotline = editHotline.map((hotline) => hotline.value || hotline);
    // const arrayVirtual = editVirtual.map((virtual) => virtual.value || virtual);
    // const initialHotline = convertStringToArray(
    //   customerInitialValues.current?.hotline
    // );
    // const initialVirtual = convertStringToArray(
    //   customerInitialValues.current?.stringVirtual
    // );
    // // Get add, delete hotline and virtualNumber
    // const deleteHotlines = getDifferenceTwoArray(initialHotline, arrayHotline);
    // const addHotlines = getDifferenceTwoArray(arrayHotline, initialHotline);
    // const deleteVirtual = getDifferenceTwoArray(initialVirtual, arrayVirtual);
    // const addVirtual = getDifferenceTwoArray(arrayVirtual, initialVirtual);
    // if (deleteHotlines.length) {
    //   deleteHotlines.forEach((item) => {
    //     callAPI.push(CustomerAPI.deleteHotline.bind(item));
    //   });
    // }
    // if (addHotlines.length) {
    //   callAPI.push(
    //     CustomerAPI.addHotline.bind({
    //       msisdn: addHotlines.join(','),
    //       customerId: data.id,
    //     })
    //   );
    // }
    // if (addVirtual.length) {
    //   callAPI.push(
    //     CustomerAPI.addVirtualNumber.bind({
    //       virtualNumber: addVirtual.join(','),
    //       customerId: data.id,
    //     })
    //   );
    // }
    // if (deleteVirtual.length) {
    //   deleteVirtual.forEach((virtual) => {
    //     const findVirtual = customerInitialValues.current?.virtual.find(
    //       (item) => item.virtualNumber === virtual
    //     );
    //     callAPI.push(
    //       CustomerAPI.deleteVirtualNumber.bind({
    //         customerId: data.id,
    //         virtualNumber: findVirtual?.virtualNumber || '',
    //         id: findVirtual?.id,
    //       })
    //     );
    //   });
    // }
    // if (dialogState.onCallAPIUpdate) {
    //   dialogState.onCallAPIUpdate(callAPI);
    // }
  };

  const getListCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getListCustomer();
      if (result) {
        customerList.current = result.customers.map((item) => ({
          label: item.customerName,
          value: item.id,
        }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListCustomer();
  }, [getListCustomer]);

  const HotlineGroupDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />
        <Dialog
          open={dialogState.isOpen}
          className="hotline-dialog"
          onClose={closeHotlineGroup}
        >
          <CloseDialog onClose={closeHotlineGroup} id="title">
            <Typography className="font--24b" textAlign="center">
              {dialogState.title}
            </Typography>
          </CloseDialog>

          <Grid>
            <form
              className="form-paper"
              onSubmit={handleSubmit(dialogState.onSubmit)}
            >
              {dialogState.isUpdate ? (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS">
                      Tên Khách hàng
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="customerName"
                      control={control}
                      className="admin-select width-100"
                      disabled
                    />
                  </Grid>
                </div>
              ) : (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS require-field">
                      Tên Khách hàng
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <SelectController
                      name="customerId"
                      options={customerList.current || []}
                      control={control}
                      className="admin-select width-100"
                    />
                  </Grid>
                </div>
              )}

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XXS require-field">
                    Tên nhóm Hotline
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="groupHotlineName"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập tên nhóm Hotline"
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
                        name="hotline"
                        control={control}
                        placeholder="Nhập số Hotline"
                      />
                    </Grid>
                  </div>

                  <div>
                    <Grid item xs={12}>
                      <Typography className="mt--XS mb--XXS require-field">
                        Trạng thái
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <SelectController
                        name="status"
                        options={STATUS_OPTIONS}
                        control={control}
                        className="admin-select width-100"
                      />
                    </Grid>
                  </div>
                </>
              ) : (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS require-field">
                      Số Hotline
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="stringHotline"
                      control={control}
                      className="admin-text-field width-100"
                      placeholder="Nhập số Hotline"
                    />
                  </Grid>
                </div>
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
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState, loading]);

  return { HotlineGroupDialog, openHotlineGroup, closeHotlineGroup };
}

export default useHotlineGroupDialog;
