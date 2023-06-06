import { Alert, Collapse, Container, IconButton } from '@mui/material';
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';

function MuiImportAlert (props:{
  openImportError:boolean,
  setOpenImportError:(b:boolean)=>void
}) {
    
  return (
    <Container>
        <Collapse in={props.openImportError} sx={{paddingTop:"5px"}}>
          <Alert variant="outlined" severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  props.setOpenImportError(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Invalid wasm file!
          </Alert>
        </Collapse>
      </Container>
  )
}

export default MuiImportAlert