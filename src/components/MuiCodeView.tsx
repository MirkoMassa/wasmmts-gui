import '../App.css';
import { useState } from 'react'
import { Collapse, Container, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
function Codeview(props: {
    watText:string,
    watOpen:boolean,
    setWatOpen: (b:boolean)=>void
    }) {
    const watTextAsArray = props.watText.split('\n');

    function collapseContainer(){
            props.setWatOpen(!props.watOpen)
      }
  return (
    <Container sx={{
        paddingY:'16px',
        borderBottom:'1px solid lightgrey'
    }}>
        <Typography variant="h6" align='center'
            className='Titles' 
            onClick={collapseContainer}
        >
        <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: props.watOpen? 'inline-block' : 'none'
            }}
            />
            <KeyboardArrowUpIcon sx={{
                display: props.watOpen? 'none' : 'inline-block'
            }}/>
        </IconButton>
         WebAssembly Text Format
         <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: props.watOpen? 'inline-block' : 'none'
            }}
          />
            <KeyboardArrowUpIcon sx={{
                display: props.watOpen? 'none' : 'inline-block'
            }}/>
        </IconButton>
        </Typography>
        <Collapse in={props.watOpen} sx={{paddingTop:"5px"}}>
            <pre className="WatText">
                {watTextAsArray.map(row => 
                <><span className="lineNum">
                    </span>
                    <code>{row}</code>
                </>)}
            </pre>
        </Collapse>
    </Container>
  )
}
export default Codeview
