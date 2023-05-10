import { Container, Typography } from '@mui/material'
import React from 'react'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { WasmFuncType } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm';

function ExecutionWrapper (props:{
  funcReturns: (number | bigint)[],
  currentWasmType:WasmFuncType
}) {
  return (
    <Container sx={{
      paddingY:'16px',
      borderBottom:'1px solid lightgrey',
      maxHeight:'60vh'
      }}>
      <Typography variant="h5" align='center'>
      <KeyboardDoubleArrowRightIcon/> Function return <KeyboardDoubleArrowLeftIcon/> 
      </Typography>

      {props.funcReturns.map((value, i) => {
        const returnType = props.currentWasmType.returns[i];
        console.log(value)
        return(
          <Typography variant="subtitle1"
            align='center'>{'[' + returnType + '] => ' + value}</Typography>
        )
      }
        

      )}
      

    </Container>
  )
}

export default ExecutionWrapper