/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { SelectItem } from '../select/select-controller.component';

interface SelectControllerProps {
  name: string;
  control: Control<any>;
  options: SelectItem[];
  placeholder?: string;
  multiple?: boolean;
  freeSolo?: boolean;
  defaultValue?: SelectItem[];
  limitTags?: number;
  disable?: boolean;
}

function AutocompleteController(props: SelectControllerProps) {
  const {
    name,
    control,
    placeholder,
    options,
    multiple,
    defaultValue,
    freeSolo,
    limitTags,
    disable,
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          sx={{ maxHeight: 150, overflow: 'auto' }}
          multiple={multiple}
          options={options}
          defaultValue={defaultValue}
          limitTags={limitTags}
          disabled={disable}
          freeSolo={freeSolo}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={placeholder}
            />
          )}
          onChange={(event, data) => {
            field.onChange(data);
            return data;
          }}
        />
      )}
    />
  );
}

AutocompleteController.defaultProps = {
  placeholder: '',
  multiple: false,
  freeSolo: false,
  defaultValue: [],
  limitTags: 6,
  disable: false,
};

export default React.memo(AutocompleteController);
