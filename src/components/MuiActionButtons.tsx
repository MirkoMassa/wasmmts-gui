import { Alert, Collapse, Container, FormControlLabel, IconButton, Input, Switch, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { WebAssemblyMtsInstance } from 'wasmmts-a_wasm_interpreter/build/src/exec/types';
import MuiParamsAlert from './alterts/MuiParamsAlert';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MuiExamples from './MuiExamples';
import { dbReqRes } from '../database';
import MuiImportedFiles from './MuiImportedFiles';
import MuiImportAlert from './alterts/MuiImportAlert';
import MuiFunctionAlert from './alterts/MuiFunctionAlert';
import MuiImportButtons from './MuiImportButtons';

import axios from 'axios';
import path from 'path';
const api_url = process.env.REACT_APP_API_URL;

function ActionButtons (
  props:{
      run:(paramsCount:number) => void,
      funcName:string,

      filename: string,
      setFilename: (f:string) => void,

      wasmInstance:WebAssemblyMtsInstance,
      showParamsAlert: boolean,
      setShowParamsAlert: (b:boolean) => void,

      execToggler: boolean,
      setExecToggler: (b:boolean) => void,

      importedName: string,
      setImportedName: (s:string) => void,
      importedBuffer: ArrayBuffer,
      setImportedBuffer: (ab:ArrayBuffer) => void,
      setWatOpen: (b:boolean) => void,

      openExamples: boolean,
      setOpenExamples: (b:boolean) => void,

      openStoredFiles:boolean,
      setOpenStoredFiles: (b:boolean) => void,

      updateWasmStoredfile: (filename:string, buffer:ArrayBuffer) => void
  }){
  const matches = useMediaQuery('(min-width:800px)');

  const [openWarning, setOpenWarning] = useState(false);
  const [funcsCount, setFuncsCount] = useState(0);
  const [paramsCount, setParamsCount] = useState(0);

  const [openError, setOpenError] = useState(false);
  const [importError, setImportError] = useState(false);
  const [openImportError, setOpenImportError] = useState(false);

  // used to execute console commands like asc compiling
  const executeCompileRequest = async (fileName: string) => {
    try {
      // passing the command in post req.body
      const response = await axios.post(`${api_url}/tscompile`, { fileName });
      console.log('res:',response.data.message);
    } catch (error) {
      // @ts-ignore
      console.error('Error executing command:', error.message);
    }
  };

  async function handleTsImport(file:File){
    console.log('type',file.type)
    const fileName = file.name;
    const filenameNoExt = fileName.slice(0, fileName.length-3);
    // idk why .ts is recognized as text/vnd.trolltech.linguist
    // so that's the check
    if(file && file.type === 'text/vnd.trolltech.linguist'){
      handleClear();
      dbReqRes(file);
      // storing temp .ts file in the server
      try {
      const formData = new FormData();
      formData.append('file', file); // Append the file to the FormData object
      // console.log('passed formdata',formData)
      const tempResponse = await axios.post(`${api_url}/uploadTemp`, formData);
      console.log(tempResponse);
      // compiling
      const compileResponse = await executeCompileRequest(fileName).then(() => {
        // retrieve wat and wasm from temp folder
        fetch(`/compiledFiles/${filenameNoExt}.wasm`)
          .then(res => res.blob())
          .then(blob => {
            const filename = `${filenameNoExt}.wasm`;
            const wasmFile = new File([blob], filename);
            console.log('obtained wasm', wasmFile);
            dbReqRes(wasmFile);
          })
        .catch(error => console.error(error));
        fetch(`/compiledFiles/${filenameNoExt}.wat`)
          .then(res => res.blob())
          .then(blob => {
            const filename = `${filenameNoExt}.wat`;
            const watFile = new File([blob], filename);
            console.log('obtained wat', watFile);
            dbReqRes(watFile);
            
          })
        .catch(error => console.error(error));
      });

      } catch (error) {
        // @ts-ignore
        console.error('Error storing temp file:', error.message);
      }

      // @TODO
      // keep the node server running in background with pm2
      // post the file to the server
      // upload the obtained files in the db
      // rename the files to have the same filename as this
      // exclude different extension than wasm on the Stored Files selector
    }
  }

  async function handleWasmImport(file:File){
    if(file && file.type === 'application/wasm'){
      // clearing everything
      handleClear();

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = () => {
        console.log(reader.error);
      }
      reader.onload = () => {
        const importedBuffer:ArrayBuffer = reader.result as ArrayBuffer;

        // Preamble check
        //WASM_BINARY_MAGIC && WASM_BINARY_VERSION
        const preamble = [0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]
        const uint8import = new Uint8Array(importedBuffer);
        console.log("buffer", importedBuffer);
        for (let i = 0; i < 8; i++) {
          if(preamble[i] !== uint8import[i]){
            setOpenImportError(true);
            return;
          }
        }
        // storing wasm in the db
        dbReqRes(file);
        props.setImportedName(file.name);
        props.setImportedBuffer(importedBuffer);
      }
    }
  }

  function executeRunButton(){
    if(props.funcName !== ''){
      props.run(paramsCount);
    }else{
        setOpenWarning(true);
    }
  }

  function handleFiles(){
    if(!props.openStoredFiles){
      props.setOpenExamples(false);
    }
    props.setOpenStoredFiles(!props.openStoredFiles)
  }

  function handleClear(){
    props.setFilename('');
    props.setImportedName('');

    props.setOpenExamples(false);
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
        {/* IMPORT ts & wasm*/}
        <MuiImportButtons
          matches={matches}
          handleWasmImport={handleWasmImport}
          handleTsImport={handleTsImport}
        />
        {/* STORED FILES BTN */}
        <IconButton size={matches?'large':'small'} onClick={handleFiles}
          sx={{
            color:'#00a152'
          }}
        >
            Stored files<FolderOpenIcon/>
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
    {/* Examples collapse */}
    <MuiExamples
      openExamples={props.openExamples}
      filename={props.filename}
      setFilename={props.setFilename}
      setImportedName={props.setImportedName}
    />
    {/* Imported files collapse */}
    <MuiImportedFiles
      openStoredFiles={props.openStoredFiles}
      setOpenStoredFiles={props.setOpenStoredFiles}
      filename={props.filename}
      setFilename={props.setFilename}
      setImportedName={props.setImportedName}
      updateWasmStoredfile={props.updateWasmStoredfile}
    />

    <MuiFunctionAlert
      openWarning={openWarning}
      setOpenWarning={setOpenWarning}
    />
    <MuiImportAlert
      openImportError={openImportError}
      setOpenImportError={setOpenImportError}
    />
    <MuiParamsAlert
      showParamsAlert={props.showParamsAlert}
      setShowParamsAlert={props.setShowParamsAlert}
    />

  </Container>
  )
}

export default ActionButtons