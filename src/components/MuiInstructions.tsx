import { Collapse, Container, IconButton, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

function MuiInstructions(props:{
    openExamples:boolean,
    setOpenExamples: (b:boolean) => void,
    setOpenStoredFiles: (b:boolean) => void,
}) {

    const matches = useMediaQuery('(min-width:800px)');
    const [openInstructions, setOpenInstructions] = useState(false);
    function handleOpenExamples(){
        if(!props.openExamples){
            props.setOpenStoredFiles(false);
          }
        props.setOpenExamples(!props.openExamples)
    }
    function collapseContainer(){
        setOpenInstructions(!openInstructions)
      }
    
    return (
        <Container sx={{paddingY:'10px', borderBottom:'1px solid lightgrey'}}>
            <Typography variant="h6" align='center'
                className='Titles' 
                onClick={collapseContainer}
            >
            <IconButton onClick={collapseContainer}>
                <KeyboardArrowDownIcon sx={{
                    display: openInstructions? 'inline-block' : 'none'
                }}
                />
                <KeyboardArrowUpIcon sx={{
                    display: openInstructions? 'none' : 'inline-block'
                }}/>
            </IconButton>
            How does it work?
            <IconButton onClick={collapseContainer}>
                <KeyboardArrowDownIcon sx={{
                    display: openInstructions? 'inline-block' : 'none'
                }}
            />
                <KeyboardArrowUpIcon sx={{
                    display: openInstructions? 'none' : 'inline-block'
                }}/>
            </IconButton>
            </Typography>
            <Collapse in={openInstructions}>
                <Typography variant='subtitle1'>
                    In order to start experimenting the debugging features,
                     try an example function! <br />
                     {/* EXAMPLES BTN */}
                    
                     <li style={{ fontWeight: 'bold' }}>Press this
                        <IconButton size={matches?'large':'small'} onClick={handleOpenExamples}
                        sx={{color:'#b26a00'}}
                        >
                            Examples<FolderOpenIcon/>
                        </IconButton>
                         button!</li>
                     <li>Select  the .wasm file you want to interpret</li>
                     <li>Enter the arguments in the input fields</li>
                     <li>Press the <KeyboardReturnIcon fontSize='small' sx={{color:'#B81414'}}/> button</li>
                     <li>Slide through the states, or press the green button to make it run autonomously!</li>
                     <li>At the bottom of the app you can view the memory cells states, if they are manipulated during the execution</li>
                </Typography>
            </Collapse>
            
        </Container>
  )
}

export default MuiInstructions