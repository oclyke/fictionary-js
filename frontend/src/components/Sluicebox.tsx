import React from 'react';

import {
  Grid,
} from '@material-ui/core';

const Sluicebox = (props: {children: any}) => {
  return (
    <Grid container>
      <Grid item xs={1}  sm={2}  md={3}/>
      <Grid item xs={10} sm={8}  md={6}>
        {props.children}
      </Grid>
      <Grid item xs={1}  sm={2}  md={3}/>
    </Grid>
  );
}

export default Sluicebox;
