import { Box, Collapse, Container, FormControl, IconButton, Input, Typography } from '@mui/material'
import React, { useState } from 'react'
import { WasmFuncType } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function MuiEnterParams(props:{
    currWasmType: WasmFuncType,
    params: number[],
    setParams: (params:number[]) => void,
    paramsOpen: boolean,
    setParamsOpen:(b:boolean) => void
    }){

    function collapseContainer(){
        props.setParamsOpen(!props.paramsOpen)
    }

    function handleInputBoxes(val:number, index:number) {
        const tempData = props.params.map(param => param);
        tempData[index] = val;
        props.setParams(tempData);
        console.log(tempData)
    }

    return (
    <Container sx={{
        paddingY:'16px',
        borderBottom:'1px solid lightgrey'
        }}>
        <Typography variant="h6" align='center'>
        <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: props.paramsOpen? 'inline-block' : 'none'
            }}
            />
            <KeyboardArrowUpIcon sx={{
                display: props.paramsOpen? 'none' : 'inline-block'
            }}/>
        </IconButton>
         Enter params here!
         <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: props.paramsOpen? 'inline-block' : 'none'
            }}
          />
            <KeyboardArrowUpIcon sx={{
                display: props.paramsOpen? 'none' : 'inline-block'
            }}/>
        </IconButton>
        </Typography>

        <Collapse in={props.paramsOpen} >
            
                {props.currWasmType.parameters && 
                props.currWasmType.parameters.map((type, i) =>
                    <FormControl fullWidth required>
                    <Input
                        onChange={(event) => handleInputBoxes(parseInt(event.target.value), i)}
                        type='number'
                        placeholder={'Parameter '+(i+1)+': ['+type+']'}
                    ></Input>
                    </FormControl>
                )}
            
        </Collapse>

    </Container>
  )
}

export default MuiEnterParams