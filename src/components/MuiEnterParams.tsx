import { Box, Collapse, Container, FormControl, IconButton, Input, Typography } from '@mui/material'
import React, { useState } from 'react'
import { WasmFuncType } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function MuiEnterParams(props:{
    currWasmType:WasmFuncType,
    params:number[],
    setParams: (params:number[])=>void,
    }){

    const [open, setOpen] = useState(true);
    function collapseContainer(){
            setOpen(!open)
    }

    
    function handleInputBoxes(val:number, index:number) {
        const tempData = props.params.map(param =>param);
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
                display: open? 'inline-block' : 'none'
            }}
            />
            <KeyboardArrowUpIcon sx={{
                display: open? 'none' : 'inline-block'
            }}/>
        </IconButton>
         Enter params here!
         <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: open? 'inline-block' : 'none'
            }}
          />
            <KeyboardArrowUpIcon sx={{
                display: open? 'none' : 'inline-block'
            }}/>
        </IconButton>
        </Typography>

        <Collapse in={open} sx={{paddingBottom:"30px"}}>
            
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