import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';

import { Button, Grid, Typography } from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import './create-trunk-dialog.style.scss';

interface CreateTrunkDialogProps {
  open: boolean;
  handleClose: (isOpen: boolean) => void;
}

interface TypeForm {
  name: string;
  ipPort: string;
  viettel: string;
  vina: string;
  mobi: string;
  fix: string;
}

function CreateTrunkDialog({ handleClose, open }: CreateTrunkDialogProps) {
  const schema = useRef(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      ipPort: yup.string().required('IP:PORT is required'),
      viettel: yup.string().required('Viettel is required'),
      vina: yup.string().required('Vina is required'),
      mobi: yup.string().required('Mobi is required'),
      fix: yup.string().required('Fix is required'),
    })
  ).current;
  const { control, handleSubmit } = useForm<TypeForm>({
    defaultValues: {
      name: '',
      ipPort: '',
      fix: '',
      mobi: '',
      viettel: '',
      vina: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: TypeForm) => {
    // Do nothing
  };

  return (
    <Dialog open={open} onClose={handleClose} className="create-trunk-dialog">
      <Typography className="font--28b">Create New Trunk</Typography>

      <Grid>
        <form className="form-paper" onSubmit={handleSubmit(onSubmit)}>
          {/* <div id="name">
            <Grid item xs={12}>
              <Typography className="mt--S mb--XS  require-field">
                Trunk name
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextFieldController
                name="name"
                control={control}
                className="onc-text-field width-100"
                placeholder="Name"
              />
            </Grid>
          </div> */}
          <Grid item xs={12}>
            <TextFieldController
              name="name"
              control={control}
              className="onc-text-field width-100"
              placeholder="Name"
            />
          </Grid>

          <Button
            className="custom-button --no-transform"
            variant="contained"
            type="submit"
          >
            Create Trunk
          </Button>
        </form>
      </Grid>
    </Dialog>
  );
}

export default React.memo(CreateTrunkDialog);
