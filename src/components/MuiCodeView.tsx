import '../App.css';
import { useState } from 'react'
import { Collapse, Container, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
function Codeview(props: {watText:string}) {
    const watTextAsArray = props.watText.split('\n');
    const [open, setOpen] = useState(true);

    function collapseContainer(){
            setOpen(!open)
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
         WebAssembly Text Format
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
        <Collapse in={open} sx={{paddingTop:"5px"}}>
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
