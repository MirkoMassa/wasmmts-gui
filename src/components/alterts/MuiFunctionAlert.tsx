import { Alert, Collapse, Container, IconButton } from '@mui/material';
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

function MuiFunctionAlert (props:{
    openWarning:boolean,
    setOpenWarning:(b:boolean)=>void
}) {
  return (
    <Container>
      <Collapse in={props.openWarning} sx={{paddingTop:"5px"}}>
        <Alert variant="outlined" severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                props.setOpenWarning(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          You need to select a function!
        </Alert>
      </Collapse>
    </Container>
  )
}

export default MuiFunctionAlert