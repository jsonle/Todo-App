import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

const ToggleSwitch = ({ showCompleted, handleToggleChange }) => (
  <FormControlLabel
    control={
      <Switch
        checked={showCompleted}
        onChange={handleToggleChange}
        color="primary"
      />
    }
    label="Show Completed"
  />
);

export default ToggleSwitch;
