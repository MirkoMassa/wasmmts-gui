// tsx asc assembly/index.ts --target release
import { Container } from '@mui/material'
import React from 'react'

import { exec } from 'child_process';

function AscConverter () {
    function ascToWasm () {
    const command = 'tsx asc assembly/index.ts --target release';
        exec(command, (error, stdout, stderror) => {
            if(error){
                console.error(error);
                return;
            } 
            console.log(stdout);
        })
    }
    

  return (
    <Container>
        
    </Container>
  )
}

export default AscConverter