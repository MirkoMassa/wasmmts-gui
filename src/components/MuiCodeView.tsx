import '../App.css';
import { useState } from 'react'
import { AppBar, Collapse, Container, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CodeIcon from '@mui/icons-material/Code';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
function Codeview(props: {
    watText:string,
    tsText:string,
    codeOpen:boolean,
    setCodeOpen: (b:boolean)=>void,
    filename:string,
    isImportedOrDb: boolean
    }) {
    const watTextAsArray = props.watText.split('\n');
    const tsTextAsArray = props.tsText.split('\n');
    const [changeCodeBool, setChangeCodeBool] = useState(false);
    function collapseContainer(){
            if(props.watText !== ''){
                props.setCodeOpen(!props.codeOpen)
            }
      }

    function changeCode(){
        setChangeCodeBool(!changeCodeBool);
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
                display: props.codeOpen? 'inline-block' : 'none'
            }}
            />
            <KeyboardArrowUpIcon sx={{
                display: props.codeOpen? 'none' : 'inline-block'
            }}/>
        </IconButton>
         Code view
         <IconButton onClick={collapseContainer}>
            <KeyboardArrowDownIcon sx={{
                display: props.codeOpen? 'inline-block' : 'none'
            }}
          />
            <KeyboardArrowUpIcon sx={{
                display: props.codeOpen? 'none' : 'inline-block'
            }}/>
        </IconButton>
        </Typography>
        <Collapse in={props.codeOpen} sx={{paddingTop:"5px"}}>
            {/* filename label */}
            <AppBar position='static' sx={{ 
                bgcolor:'lightgrey',

                }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    marginLeft: '10px',
                    marginRight: '10px',
                    }}>
                    <InsertDriveFileIcon sx={{
                        color:'black',
                        marginRight:'5px'
                    }}/>
                    <Typography variant="subtitle1" color='black' style={{ flexGrow: 1 }}>{props.filename}
                        {changeCodeBool? '.wat' : '.ts'}
                    </Typography>
                    
                    {/* Change code between .ts and .wat */}
                    <IconButton onClick={changeCode}>
                    <CodeIcon/>
                    <Typography variant="subtitle1" color='black'>
                        {changeCodeBool? '.ts' : '.wat'}
                    </Typography>
                </IconButton>
            </div>
            </AppBar>
            {/* wat code */}
            <pre className="WatText" style={{
                display: changeCodeBool? 'grid' : 'none'
                }}>                    
                {watTextAsArray.map(row => 
                <><span className="lineNum">
                    </span>
                    <code>{row}</code>
                </>)}
            </pre>
            {/* ts code */}
            <pre className="WatText" style={{
                display: changeCodeBool? 'none' : 'grid'
                }}>                    
                {tsTextAsArray.map(row => 
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
