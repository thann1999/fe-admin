import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';

import { Button, DialogActions, Grid, Stack, Typography } from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import './create-trunk-dialog.style.scss';

interface CreateTrunkDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface TypeForm {
  name: string;
  ipPort: string;
  viettel: string;
  vinaphone: string;
  mobiphone: string;
  fix: string;
}

function CreateTrunkDialog({ handleClose, open }: CreateTrunkDialogProps) {
  const schema = useRef(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      ipPort: yup.string().required('IP:PORT is required'),
      viettel: yup.string().required('Viettel is required'),
      vinaphone: yup.string().required('Vina is required'),
      mobiphone: yup.string().required('Mobi is required'),
      fix: yup.string().required('Fix is required'),
    })
  ).current;
  const { control, handleSubmit } = useForm<TypeForm>({
    defaultValues: {
      name: '',
      ipPort: '',
      fix: '',
      mobiphone: '',
      viettel: '',
      vinaphone: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: TypeForm) => {
    // Do nothing
  };

  return (
    <Dialog open={open} className="create-trunk-dialog" onClose={handleClose}>
      <Typography className="font--28b" textAlign="center">
        Create New Trunk
      </Typography>

      <Grid>
        <form className="form-paper" onSubmit={handleSubmit(onSubmit)}>
          <div id="name">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS  require-field">
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

          <div id="ipPort">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS  require-field">
                IP:PORT
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="ipPort"
                control={control}
                className="admin-text-field width-100"
                placeholder="Name"
              />
            </Grid>
          </div>

          <div id="viettel">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS  require-field">
                Viettel
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="viettel"
                control={control}
                className="admin-text-field width-100"
                placeholder="Name"
              />
            </Grid>
          </div>

          <div id="mobiphone">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS  require-field">
                Mobiphone
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="mobiphone"
                control={control}
                className="admin-text-field width-100"
                placeholder="Name"
              />
            </Grid>
          </div>

          <div id="vinaphone">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS  require-field">
                Vinaphone
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="vinaphone"
                control={control}
                className="admin-text-field width-100"
                placeholder="Name"
              />
            </Grid>
          </div>

          <div id="fix">
            <Grid item xs={12}>
              <Typography className="mt--XS mb--XS  require-field">
                Fix
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="fix"
                control={control}
                className="admin-text-field width-100"
                placeholder="Name"
              />
            </Grid>
          </div>

          <DialogActions className="dialog-actions mt--MS">
            <Button
              variant="contained"
              color="inherit"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Create
            </Button>
          </DialogActions>
        </form>
      </Grid>
    </Dialog>
  );
}

export default React.memo(CreateTrunkDialog);
