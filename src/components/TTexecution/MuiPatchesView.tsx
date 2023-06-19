import { Collapse, Container, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import ExtensionIcon from '@mui/icons-material/Extension';
import { patchesDescriptor } from 'wasmmts/build/src/debugging/stringifier';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function MuiPatchesView (props:{
        wasmPatches: patchesDescriptor[],
        val:number
        }) {

    const [patchesOpen, setPatchesOpen] = useState(true)
    function collapseContainer(){
        setPatchesOpen(!patchesOpen)
    }
    
    let printPatches = () => {
        const patchesDesc = props.wasmPatches[props.val].description;
        if(patchesDesc === undefined){
            return <Typography variant='subtitle1' sx={{
                border:'2px solid grey',
                paddingY:'5px',
              }}>No patches for this state</Typography>
        }
        
        return patchesDesc.map(desc => 
            <Typography variant='subtitle1' sx={{
                border:'2px solid grey',
                paddingY:'5px',
              }}>{desc}</Typography>)
    }
  return (
    <Container sx={{
        paddingY:'16px',
        maxHeight:'60vh',
        borderBottom:'1px solid lightgrey',
    }}>
        <Typography variant="h5" align='center'
            className='Titles' 
            onClick={collapseContainer}
        >
        <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: patchesOpen ? 'inline-block' : 'none'
            }}
            />
            <KeyboardArrowUpIcon sx={{
                display: patchesOpen ? 'none' : 'inline-block'
            }}/>
        </IconButton>
            <ExtensionIcon fontSize='small'/> Patches <ExtensionIcon fontSize='small'/> 
         <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: patchesOpen ? 'inline-block' : 'none'
            }}
          />
            <KeyboardArrowUpIcon sx={{
                display: patchesOpen ? 'none' : 'inline-block'
            }}/>
        </IconButton>
        </Typography>
        <Collapse in={patchesOpen} sx={{overflowY:'scroll'}}>
            {props.wasmPatches.length!==0 && printPatches()}
        </Collapse>
    </Container>
  )
}

export default MuiPatchesView