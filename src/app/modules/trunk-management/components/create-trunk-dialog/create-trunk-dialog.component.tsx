import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import SelectController from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import { TELECOM_OPTIONS } from '../../shared/create-trunk-dialog.const';
import './create-trunk-dialog.style.scss';

interface CreateTrunkDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface TypeForm {
  name: string;
  ipPort: string;
  telecom: string;
}

function CreateTrunkDialog({ handleClose, open }: CreateTrunkDialogProps) {
  const schema = useRef(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      ipPort: yup.string().required('IP:Port is required'),
      telecom: yup.string().required('Telecom is required'),
    })
  ).current;
  const { control, handleSubmit, reset } = useForm<TypeForm>({
    defaultValues: {
      name: '',
      ipPort: '',
      telecom: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: TypeForm) => {
    // Do nothing
  };

  const closeDialog = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog open={open} className="create-trunk-dialog" onClose={closeDialog}>
      <CloseDialog onClose={closeDialog} id="title">
        <Typography className="font--24b" textAlign="center">
          Create New Trunk
        </Typography>
      </CloseDialog>

      <Grid>
        <form className="form-paper" onSubmit={handleSubmit(onSubmit)}>
          <div id="name">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS require-field">
                Trunk name
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="name"
                control={control}
                className="admin-text-field width-100"
                placeholder="Name"
              />
            </Grid>
          </div>

          <div id="telecom">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS require-field">
                Telecom
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

          <div id="ipPort">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS require-field">
                IP:Port
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="ipPort"
                control={control}
                className="admin-text-field width-100"
                placeholder="Ip:Port"
              />
            </Grid>
          </div>

          <Button
            variant="contained"
            type="submit"
            className="action-button --no-transform width-100 "
          >
            Create
          </Button>
        </form>
      </Grid>
    </Dialog>
  );
}

export default React.memo(CreateTrunkDialog);
