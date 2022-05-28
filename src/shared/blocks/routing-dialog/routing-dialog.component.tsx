import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, SelectChangeEvent, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TrunkAPI from 'app/api/trunk.api';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import SelectController, {
  SelectItem,
} from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import './routing-dialog.style.scss';
import {
  DialogState,
  OpenDialogProps,
  RoutingForm,
} from './routing-dialog.type';

function useHotlineRoutingDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: false,
    onSubmit: () => {},
    customerGroupOptions: [],
    listCustomerGroup: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const trunkList = useRef<SelectItem[]>();
  const schema = useRef(
    yup.object().shape({
      customerName: yup.string().required('Vui lòng chọn nhóm Hotline'),
      hotlineGroupId: yup.string(),
      hotlineGroupName: yup.string(),
      trunkId: yup.string().required('Vui lòng chọn Trunk'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<RoutingForm>({
    defaultValues: {
      customerId: 0,
      customerName: '',
      hotlineGroupName: '',
      hotlineGroupId: '',
      status: 0,
      trunkId: '',
    },
    resolver: yupResolver(schema),
  });

  const openHotlineRouting = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
    listCustomerGroup,
  }: OpenDialogProps) => {
    if (initialValues) {
      const {
        customerId,
        customerName,
        hotlineGroupId,
        hotlineGroupName,
        groupStatus,
        trunkId,
      } = initialValues;
      setValue('customerId', customerId);
      setValue('customerName', customerName);
      setValue('hotlineGroupId', String(hotlineGroupId));
      setValue('hotlineGroupName', hotlineGroupName);
      setValue('status', groupStatus);
      setValue('trunkId', trunkId);
      schema.fields.hotlineGroupName = yup
        .string()
        .required('Vui lòng chọn nhóm Hotline');
    } else {
      schema.fields.hotlineGroupId = yup
        .string()
        .required('Vui lòng chọn nhóm Hotline');
    }
    setDialogState((prev) => ({
      ...prev,
      title,
      isUpdate,
      onSubmit,
      listCustomerGroup,
      isOpen: true,
      customerGroupOptions:
        listCustomerGroup?.map((item) => ({
          label: item.hotlineGroupName,
          value: item.hotlineGroupId,
        })) || [],
    }));
  };

  const onChangeHotline = (event: SelectChangeEvent<unknown>) => {
    const findHotline = dialogState.listCustomerGroup?.find(
      (item) => String(item.hotlineGroupId) === event.target.value
    );
    if (findHotline) {
      setValue('customerId', findHotline.customerId || '');
      setValue('customerName', findHotline.customerName || '');
    }
  };

  const closeHotlineRouting = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const getListTrunk = useCallback(async () => {
    try {
      setLoading(true);
      const result = await TrunkAPI.getListTrunk();
      if (result) {
        trunkList.current = result.groupIps.map((item) => ({
          label: item.trunkName,
          value: item.id,
        }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListTrunk();
  }, [getListTrunk]);

  const HotlineRoutingDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />
        <Dialog
          open={dialogState.isOpen}
          className="hotline-dialog"
          onClose={closeHotlineRouting}
        >
          <CloseDialog onClose={closeHotlineRouting} id="title">
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
                    Tên Khách hàng
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="customerName"
                    control={control}
                    className="admin-text-field width-100"
                    disabled
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XXS require-field">
                    Tên nhóm Hotline
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  {dialogState.isUpdate ? (
                    <TextFieldController
                      name="hotlineGroupName"
                      control={control}
                      className="admin-text-field width-100"
                      disabled
                    />
                  ) : (
                    <SelectController
                      name="hotlineGroupId"
                      control={control}
                      options={dialogState.customerGroupOptions}
                      className="admin-select width-100"
                      handleChange={onChangeHotline}
                    />
                  )}
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XXS require-field">
                    Tên Trunk
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="trunkId"
                    control={control}
                    options={trunkList.current || []}
                    className="admin-select width-100"
                  />
                </Grid>
              </div>

              {dialogState.isUpdate && (
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

  return {
    HotlineRoutingDialog,
    openHotlineRouting,
    closeHotlineRouting,
  };
}

export default useHotlineRoutingDialog;
