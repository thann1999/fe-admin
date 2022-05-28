/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, SelectChangeEvent, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TrunkAPI, { TrunkList } from 'app/api/trunk.api';
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
import { GroupCodeList } from 'shared/const/trunk.const';
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
  const viettelList = useRef<SelectItem[]>([]);
  const mobiList = useRef<SelectItem[]>([]);
  const vinaList = useRef<SelectItem[]>([]);
  const defaultList = useRef<SelectItem[]>([]);
  const schema = useRef(
    yup.object().shape({
      customerName: yup.string().required('Vui lòng chọn nhóm Virtual'),
      virtualGroupId: yup.string(),
      virtualGroupName: yup.string(),
      viettelTrunkId: yup.string().required('Vui lòng chọn Viettel Trunk'),
      mobiTrunkId: yup.string().required('Vui lòng chọn Mobi Trunk'),
      vinaTrunkId: yup.string().required('Vui lòng chọn Vina Trunk'),
      defaultTrunkId: yup.string().required('Vui lòng chọn Detault Trunk'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<RoutingForm>({
    defaultValues: {
      customerId: 0,
      customerName: '',
      virtualGroupName: '',
      virtualGroupId: '',
      status: 0,
      viettelTrunkId: '',
      defaultTrunkId: '',
      mobiTrunkId: '',
      vinaTrunkId: '',
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
      const { customerId, customerName, status, vngName, vngId, vngTrunks } =
        initialValues;
      const findViettel = vngTrunks.find(
        (item) => item.groupCode === GroupCodeList.viettel
      );
      const findMobi = vngTrunks.find(
        (item) => item.groupCode === GroupCodeList.mobi
      );
      const findVina = vngTrunks.find(
        (item) => item.groupCode === GroupCodeList.vina
      );
      const findDefault = vngTrunks.find(
        (item) => item.groupCode === GroupCodeList.default
      );

      setValue('customerId', customerId);
      setValue('customerName', customerName);
      setValue('virtualGroupId', String(vngId));
      setValue('virtualGroupName', vngName);
      setValue('status', status);
      setValue('viettelTrunkId', findViettel?.trunkId || '');
      setValue('viettelVngtId', findViettel?.vngtId || '');
      setValue('mobiTrunkId', findMobi?.trunkId || '');
      setValue('mobiVngtId', findMobi?.vngtId || '');
      setValue('vinaTrunkId', findVina?.trunkId || '');
      setValue('vinaVngtId', findVina?.vngtId || '');
      setValue('defaultTrunkId', findDefault?.trunkId || '');
      setValue('defaultVngtId', findDefault?.vngtId || '');
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
      const listGroupCode = [
        GroupCodeList.viettel,
        GroupCodeList.mobi,
        GroupCodeList.vina,
        GroupCodeList.default,
      ];
      const callAPI: any[] = [];
      listGroupCode.forEach((item) => {
        callAPI.push(() => {
          return TrunkAPI.getDetailTrunk(item);
        });
      });
      const result: TrunkList[] = await Promise.all(
        callAPI.map((api) => api())
      );

      if (result) {
        viettelList.current = convertData(result[0]);
        mobiList.current = convertData(result[1]);
        vinaList.current = convertData(result[2]);
        defaultList.current = convertData(result[3]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const convertData = (data: TrunkList): SelectItem[] => {
    return data.groupIps.map((item) => ({
      label: item.trunkName,
      value: item.id,
    }));
  };

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
                  <Typography className="mt--XXS mb--XXS require-field">
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
                  <Typography className="mt--XXS mb--XXS require-field">
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
                  <Typography className="mt--XXS mb--XXS require-field">
                    Viettel Trunk
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="viettelTrunkId"
                    control={control}
                    options={viettelList.current || []}
                    className="admin-select width-100"
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XXS mb--XXS require-field">
                    Mobiphone Trunk
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="mobiTrunkId"
                    control={control}
                    options={mobiList.current || []}
                    className="admin-select width-100"
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XXS mb--XXS require-field">
                    Vinaphone Trunk
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="vinaTrunkId"
                    control={control}
                    options={vinaList.current || []}
                    className="admin-select width-100"
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XXS mb--XXS require-field">
                    Default Trunk
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="defaultTrunkId"
                    control={control}
                    options={defaultList.current || []}
                    className="admin-select width-100"
                  />
                </Grid>
              </div>

              {dialogState.isUpdate && (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XXS mb--XXS require-field">
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
