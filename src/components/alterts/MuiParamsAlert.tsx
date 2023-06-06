import { Alert, Collapse, Container, IconButton } from '@mui/material';
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';

function MuiParamsAlert (props:{
  showParamsAlert:boolean,
  setShowParamsAlert:(b:boolean)=>void
}) {
    
  return (
    <Container>
        <Collapse in={props.showParamsAlert} sx={{paddingTop:"5px"}}>
          <Alert variant="outlined" severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  props.setShowParamsAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Some args are missing!
          </Alert>
        </Collapse>
      </Container>
  )
}

export default MuiParamsAlert