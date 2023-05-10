import { Alert, Collapse, Container, FormControlLabel, IconButton, Switch, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CloseIcon from '@mui/icons-material/Close';
import { WebAssemblyMtsInstance } from 'wasmmts-a_wasm_interpreter/build/src/exec/types';
import MuiParamsAlert from './alterts/MuiParamsAlert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MuiExamples from './MuiExamples';
function ActionButtons (props:{
      run:(paramsCount:number) => void,
      funcName:string,

      filename: string,
      setFilename: (f:string) => void,

      wasmInstance:WebAssemblyMtsInstance,
      showParamsAlert: boolean,
      
      execToggler: boolean,
      setExecToggler: (b:boolean) => void
  }){

  const matches = useMediaQuery('(min-width:800px)');
  
  const [openWarning, setOpenWarning] = useState(false);
  const [visibleInputs, setVisibleInputs] = useState(false);
  const [funcsCount, setFuncsCount] = useState(0);
  const [paramsCount, setParamsCount] = useState(0);
  
  const [openError, setOpenError] = useState(false);
  const [openExamples, setOpenExamples] = useState(false);

  function executeRunButton(){
    if(props.funcName !== ''){
      props.run(paramsCount);
      if(props.showParamsAlert === true){
        setOpenError(true);
      }
    }else{
        setOpenWarning(true);
    }
  }

  function handleOpenExamples(){
    setOpenExamples(!openExamples)
  }
  function handleClear(){
    props.setFilename('');
  }
  function handleRunSwitch(){
    props.setExecToggler(!props.execToggler)
  }

  useEffect(() => {
    const count = props.wasmInstance.exportsTT !== undefined 
    && Object.keys(props.wasmInstance.exportsTT).length;
    setFuncsCount(count as number);
    
    return () => {
    }
  }, [props.wasmInstance])
  
  return (
  <Container>

    <Container sx={{
      display:'flex',
      flexWrap:'wrap',
      paddingY:'16px',
      paddingX:'0px',
      justifyContent:'space-between',
      borderBottom:'1px solid lightgrey'
    }}>
        {/* IMPORT BTN */}
        <IconButton size={matches?'large':'small'} color='primary'>
            Import<UploadFileIcon/>
        </IconButton>

        {/* EXAMPLES BTN */}
        <IconButton size={matches?'large':'small'} onClick={handleOpenExamples}
          sx={{
            color:'#b26a00'
          }}
        >
            Examples<FolderOpenIcon/>
        </IconButton>

        {/* CLEAR BTN */}
        <IconButton size={matches?'large':'small'} onClick={handleClear}
          sx={{
            color:'gray',
          }}
        >
            Clear<DeleteOutlineIcon/>
        </IconButton>

        {/* RUN BTN */}
        <IconButton size={matches?'large':'small'} onClick={executeRunButton}
          sx={{
            color:'#B81414',
          }}
        >
            Run<KeyboardReturnIcon/>
        </IconButton>

        {/* TOGGLER SWITCH */}
        <div className='LineBreak'/>
        <FormControlLabel sx={{width:'100%'}}
          control={<Switch defaultChecked onClick={handleRunSwitch}/>}
          label="Toggle Time Travel execution"
          labelPlacement="bottom"
        />
        
        
    </Container>

    {props.showParamsAlert ? 
    <MuiParamsAlert openError={openError} setOpenError={setOpenError}/> 
    : null}
    <MuiExamples openExamples={openExamples} filename={props.filename} setFilename={props.setFilename}/>

    <Container>
      <Collapse in={openWarning} sx={{paddingTop:"5px"}}>
        <Alert variant="outlined" severity="warning"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenWarning(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          You need to select a function!
        </Alert>
      </Collapse>
    </Container>
    
  </Container>
  )
}

export default ActionButtons