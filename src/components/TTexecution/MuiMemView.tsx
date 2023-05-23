import { Collapse, Container, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import MemoryIcon from '@mui/icons-material/Memory';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
function MuiMemView (props:{
    memStates:number[][][],
    setMemsGrid:()=>number[][],
    currentMem:number,
    setCurrentMem:(n:number)=>void,
    val:number
}) {
    const [memOpen, setMemOpen] = useState(false);

    function collapseContainer(){
        if(props.setMemsGrid().length !== 0){
            setMemOpen(!memOpen);
            console.log("memStates",props.memStates);
            console.log("rows",memsRows);
        }
        
    }

    const [memsRows, setMemsRows] = useState([] as number[][]);

    useEffect(() => {
        const memsGrid = props.setMemsGrid()
        if(memsGrid !== undefined){
            setMemsRows(memsGrid);
        }
    }, [props.val])
    
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
                display: memOpen ? 'inline-block' : 'none'
            }}
            />
            <KeyboardArrowUpIcon sx={{
                display: memOpen ? 'none' : 'inline-block'
            }}/>
        </IconButton>
            <MemoryIcon/> Memory <MemoryIcon/> 
         <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: memOpen ? 'inline-block' : 'none'
            }}
          />
            <KeyboardArrowUpIcon sx={{
                display: memOpen ? 'none' : 'inline-block'
            }}/>
        </IconButton>
        </Typography>
        <Collapse in={memOpen} sx={{overflowY:'scroll'}}>
            <pre className="WatText">
                {memsRows.map(row => 
                <><span className="lineNum">
                    <code className='MemView'>{row.map(val => val.toString(16))}</code>
                    </span>
                </>)}
            </pre>
        </Collapse>
    </Container>
  )
}

export default MuiMemView