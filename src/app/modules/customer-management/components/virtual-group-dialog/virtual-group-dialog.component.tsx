import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CustomerAPI, {
  VirtualNumber,
  VirtualNumberGroup,
} from 'app/api/customer.api';
import { convertArrayToSelectItem } from 'app/helpers/array.helper';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import AutocompleteController from 'shared/form/autocomplete/autocomplete-controller.component';
import SelectController, {
  SelectItem,
} from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import {
  DialogState,
  GroupVirtualForm,
  OpenDialogProps,
} from '../../shared/virtual-group-dialog.type';
import './virtual-group-dialog.style.scss';

function useVirtualGroupDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: false,
    onSubmit: () => {},
    virtualOptions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const customerList = useRef<SelectItem[]>();
  const schema = useRef(
    yup.object().shape({
      customerName: yup.string().required('Vui lòng chọn Khách hàng'),
      vngName: yup.string().required('Vui lòng nhập tên nhóm Virtual'),
      stringVirtual: yup.string().required('Vui lòng nhập số Virtual'),
    })
  ).current;
  const initialGroupVirtual = useRef<VirtualNumberGroup>();
  const { control, handleSubmit, reset, setValue } = useForm<GroupVirtualForm>({
    defaultValues: {
      customerId: 0,
      stringVirtual: '',
      vngName: '',
      virtual: [],
    },
    resolver: yupResolver(schema),
  });

  const openVirtualGroup = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { customerId, vngName, vngId, virtualNumbers, status } =
        initialValues;
      initialGroupVirtual.current = initialValues;
      const virtualOptions = convertArrayToSelectItem<VirtualNumber>(
        virtualNumbers,
        'isdn',
        'vnId'
      );
      setValue('customerId', customerId);
      setValue('virtual', virtualOptions);
      setValue('id', vngId);
      setValue('vngName', vngName);
      setValue('status', status);
      setDialogState((prev) => ({ ...prev, virtualOptions }));
    }
    setDialogState((prev) => ({
      ...prev,
      title,
      isUpdate,
      onSubmit,
      isOpen: true,
    }));
  };

  const closeVirtualGroup = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleUpdate = async (data: GroupVirtualForm) => {};

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
    if (dialogState.isOpen) getListCustomer();
  }, [dialogState.isOpen, getListCustomer]);

  const VirtualGroupDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />
        <Dialog
          open={dialogState.isOpen}
          className="virtual-dialog"
          onClose={closeVirtualGroup}
        >
          <CloseDialog onClose={closeVirtualGroup} id="title">
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
                  <SelectController
                    name="customerName"
                    options={customerList.current || []}
                    control={control}
                    className="admin-select width-100"
                    placeholder="Chọn khách hàng"
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
                  <TextFieldController
                    name="vngName"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập tên nhóm Virtual"
                  />
                </Grid>
              </div>

              {dialogState.isUpdate ? (
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
                      name="virtual"
                      control={control}
                      placeholder="Nhập số Virtual"
                    />
                  </Grid>
                </div>
              ) : (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS require-field">
                      Số Virtual
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="stringVirtual"
                      control={control}
                      className="admin-text-field width-100"
                      placeholder="Nhập số Virtual"
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

  return { VirtualGroupDialog, openVirtualGroup, closeVirtualGroup };
}

export default useVirtualGroupDialog;
