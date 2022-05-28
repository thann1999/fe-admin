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
import './virtual-routing-dialog.style.scss';
import {
  DialogState,
  OpenDialogProps,
  RoutingForm,
} from '../../shared/virtual-routing-dialog.type';

function useVirtualRoutingDialog() {
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
      customerName: yup.string().required('Vui lòng chọn nhóm Virtual'),
      virtualGroupId: yup.string(),
      virtualGroupName: yup.string(),
      trunkId: yup.array().length(4, 'Vui lòng chọn 4 Trunk'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<RoutingForm>({
    defaultValues: {
      customerId: 0,
      customerName: '',
      virtualGroupName: '',
      virtualGroupId: '',
      status: 0,
      trunkId: [],
    },
    resolver: yupResolver(schema),
  });

  const openVirtualRouting = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
    listCustomerGroup,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { customerId, customerName, status, vngName, vngId } =
        initialValues;
      setValue('customerId', customerId);
      setValue('customerName', customerName);
      setValue('virtualGroupId', String(vngId));
      setValue('virtualGroupName', vngName);
      setValue('status', status);
      // setValue('trunkId', trunkId);
      schema.fields.virtualGroupName = yup
        .string()
        .required('Vui lòng chọn nhóm Virtual');
    } else {
      schema.fields.virtualGroupId = yup
        .string()
        .required('Vui lòng chọn nhóm Virtual');
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
          label: item.vngName,
          value: item.vngId,
        })) || [],
    }));
  };

  const onChangeVirtual = (event: SelectChangeEvent<unknown>) => {
    const findVirtual = dialogState.listCustomerGroup?.find(
      (item) => item.vngId === event.target.value
    );
    if (findVirtual) {
      setValue('customerId', findVirtual.customerId || '');
      setValue('customerName', findVirtual.customerName || '');
    }
  };

  const closeVirtualRouting = () => {
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

  const VirtualRoutingDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />
        <Dialog
          open={dialogState.isOpen}
          className="virtual-dialog"
          onClose={closeVirtualRouting}
        >
          <CloseDialog onClose={closeVirtualRouting} id="title">
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
                    Tên nhóm Virtual
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  {dialogState.isUpdate ? (
                    <TextFieldController
                      name="virtualGroupName"
                      control={control}
                      className="admin-text-field width-100"
                      disabled
                    />
                  ) : (
                    <SelectController
                      name="virtualGroupId"
                      control={control}
                      options={dialogState.customerGroupOptions}
                      className="admin-select width-100"
                      handleChange={onChangeVirtual}
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
                    multiple
                    multiline
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
    VirtualRoutingDialog,
    openVirtualRouting,
    closeVirtualRouting,
  };
}

export default useVirtualRoutingDialog;
