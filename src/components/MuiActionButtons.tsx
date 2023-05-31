import { Alert, Collapse, Container, FormControlLabel, IconButton, Input, Switch, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CloseIcon from '@mui/icons-material/Close';
import { WebAssemblyMtsInstance } from 'wasmmts-a_wasm_interpreter/build/src/exec/types';
import MuiParamsAlert from './alterts/MuiParamsAlert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MuiExamples from './MuiExamples';
import { addFileToDB } from '../database';
function ActionButtons (props:{
      run:(paramsCount:number) => void,
      funcName:string,

      filename: string,
      setFilename: (f:string) => void,

      wasmInstance:WebAssemblyMtsInstance,
      showParamsAlert: boolean,
      
      execToggler: boolean,
      setExecToggler: (b:boolean) => void,

      importedName: string,
      setImportedName: (s:string) => void,
      importedBuffer: ArrayBuffer,
      setImportedBuffer: (ab:ArrayBuffer) => void
      setWatOpen: (b:boolean) => void


  }){
  const matches = useMediaQuery('(min-width:800px)');
  
  const [openWarning, setOpenWarning] = useState(false);
  const [funcsCount, setFuncsCount] = useState(0);
  const [paramsCount, setParamsCount] = useState(0);
  
  
  const [openError, setOpenError] = useState(false);
  const [openExamples, setOpenExamples] = useState(false);

  async function handleImport(file:File){
    if(file){
      addFileToDB(file);
      // clearing everything
      handleClear();
      props.setImportedName(file.name);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = () => {
        console.log(reader.error);
      }
      reader.onload = () => {
        const importedBuffer:ArrayBuffer = reader.result as ArrayBuffer;
        console.log("buffer", importedBuffer);
        props.setImportedBuffer(importedBuffer);
      }
    }
  }

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
    props.setImportedName('');

    setOpenExamples(false);
    props.setWatOpen(false);
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
  <Container sx={{
    paddingY:'16px', paddingBottom:'0px'}}>
    {(props.importedName!=='' || props.filename !== '') && <Container sx={{
      paddingY:'16px',
      border:'1px solid lightgrey',
    }}>
      <Typography variant='h6' align='center'>
        Selected:{' '}
        {props.importedName !== '' ? 
        props.importedName : 
        props.filename+'.wasm'}
      </Typography>
    </Container>}

    <Container sx={{
      display:'flex',
      flexWrap:'wrap',
      paddingY:'16px',
      paddingX:'0px',
      justifyContent:'space-between'
    }}>
        {/* IMPORT BTN */}
        <label htmlFor='binary'>
          <input
            id='binary'
            type='file'
            accept="application/wasm"
            multiple
            style={{ position: 'fixed', top: '-100em' }}
            onChange={(event) =>handleImport(event.target.files![0])}
          />
          <Tooltip title='Upload Files'>
            <IconButton size={matches?'large':'small'}
            color='primary'
            component='span'
            >
              Import<UploadFileIcon/>
            </IconButton>
          </Tooltip>
        
        </label>

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
    <MuiExamples 
      openExamples={openExamples} 
      filename={props.filename} 
      setFilename={props.setFilename}
      setImportedName={props.setImportedName}
      />

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