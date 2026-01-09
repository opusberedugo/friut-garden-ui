import React from 'react';
import Grid from '../layout/Grid';
import ErrorLabel from './ErrorLabel';

export default function FormGroup({className='', error, children}){
  return(
    <>
    <Grid classes={className}>
      {children}
    </Grid>
    <ErrorLabel error={error}/>
    </>
  )
}
