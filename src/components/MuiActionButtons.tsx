import { Alert, Collapse, Container, IconButton, useMediaQuery } from '@mui/material'
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
      setwatText:(filename:string) => void,
      funcName:string,

      filename: string,
      setFilename: (f:string) => void,

      wasmInstance:WebAssemblyMtsInstance,
      showParamsAlert: boolean
      
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
      paddingY:'16px',
      paddingX:'0px',
      gap: '10px',
      justifyContent:'space-between',
      borderBottom:'1px solid lightgrey'
    }}>
        <IconButton size={matches?'large':'small'} color='primary'>
            Import<UploadFileIcon/>
        </IconButton>

        <IconButton size={matches?'large':'small'} onClick={handleOpenExamples}
          sx={{
            color:'#b26a00'
          }}
        >
            Examples<FolderOpenIcon/>
        </IconButton>
        
        <IconButton size={matches?'large':'small'} onClick={()=>props.setwatText('')}
          sx={{
            color:'gray',
          }}
        >
            Clear<DeleteOutlineIcon/>
        </IconButton>

        <IconButton size={matches?'large':'small'} onClick={executeRunButton}
          sx={{
            color:'#B81414',
          }}
        >
            Run<KeyboardReturnIcon/>
        </IconButton>
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