import {buildStateStrings, patchesDescriptor, stateDescriptor, buildPatchesStrings, 
    buildMemStatesStrings, memDescriptors, buildMemStatesArrays } from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier'
import WASMMTS, { WasmFuncType } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm'
import * as execTypes from 'wasmmts-a_wasm_interpreter/build/src/exec/types'
import { custom } from 'wasmmts-a_wasm_interpreter/build/src/types';

import './App.css';
import React, { useEffect, useState } from 'react';
import MuiTopbar from './components/navbar/MuiTopbar';
import ActionButtons from './components/MuiActionButtons';
import MuiCodeView from './components/MuiCodeView';
import MuiFunctionSelector from './components/MuiFunctionSelector';
import MuiStackView from './components/TTexecution/MuiStackView';
import MuiStateSlider from './components/TTexecution/MuiStateSlider';
import MuiEnterParams from './components/MuiEnterParams';
import { Alert, Collapse, Container, IconButton } from '@mui/material';
import MuiParamsAltert from './components/alterts/MuiParamsAlert';
import MuiParamsAlert from './components/alterts/MuiParamsAlert';
import MuiInstructions from './components/MuiInstructions';
import MuiPatchesView from './components/TTexecution/MuiPatchesView';
import MuiMemView from './components/TTexecution/MuiMemView';
import TTexecutionWrapper from './components/TTexecutionWrapper';
import ExecutionWrapper from './components/ExecutionWrapper';


function App() {
  const [wasmStates, setwasmStates] = useState([] as stateDescriptor[]);
  const [wasmStores, setWasmStores] = useState({} as execTypes.storeProducePatches);
  const [funcname, setFuncname] = useState('');

  const [filename, setFilename] = useState('');
  
  const [importedBuffer, setImportedBuffer] = useState({} as ArrayBuffer);
  const [importedName, setImportedName] = useState('');

  const [wasmInstance, setWasmInstance] = useState({} as execTypes.WebAssemblyMtsInstance);
  const [wasmModule, setWasmModule] = useState({} as execTypes.WebAssemblyMtsModule);
  const [watText, setwatText] = useState('');
  const [wasmPatches, setwasmPatches] = useState([] as patchesDescriptor[]);
  const [val, setVal] = useState(-1);

  async function updateWasmExample(filename:string){
    setIsImportedOrDb(false);
    console.log('porcamiseria')
    setwasmStates([]);
    setWasmStores({} as execTypes.storeProducePatches);
    setwasmPatches([] as patchesDescriptor[]);
    setFilename(filename);
    setwatText(await getWat(`${filename}.wat`));
    const instSource = await instantiateModule(filename);
    setWasmInstance(instSource.instance);
    setWasmModule(instSource.module);
  }

  async function updateWasmImport(filename:string){
    setIsImportedOrDb(true);
    setwasmStates([]);
    setWasmStores({} as execTypes.storeProducePatches);
    setwasmPatches([] as patchesDescriptor[]);
    setFilename(filename);
    const instSource = await instantiateModule();
    setWasmInstance(instSource.instance);
    setWasmModule(instSource.module);
  }
  async function updateWasmStoredfile(filename:string, buffer:ArrayBuffer){
    setIsImportedOrDb(true);
    setwasmStates([]);
    setWasmStores({} as execTypes.storeProducePatches);
    setwasmPatches([] as patchesDescriptor[]);
    setFilename(filename);
    const instSource = await instantiateStoredFile(buffer);
    setWasmInstance(instSource.instance);
    setWasmModule(instSource.module);
  }

  // Returns & types hooks
  const [funcReturns, setFuncReturns] = useState([] as (number | bigint)[]);
  const [currentWasmType, setCurrentWasmType] = useState({} as WasmFuncType);
  const [params, setParams] = useState([] as number[]);

  // Collapsers hooks & togglers
  const [ShowParamsAlert, setShowParamsAlert] = useState(false);
  const [watOpen, setWatOpen] = useState(false);
  const [paramsOpen, setParamsOpen] = useState(false);
  const [execToggler, setExecToggler] = useState(true);
  const [openExamples, setOpenExamples] = useState(false);
  const [openStoredFiles, setOpenStoredFiles] = useState(false);
  const [isImportedOrDb, setIsImportedOrDb] = useState(false);

  // Mems
  type threednumberarr = number[][][]
  const [memStates, setMemStates] = useState([] as threednumberarr);
  const [memStatesRows, setMemStatesRows] = useState([] as number[][])
  const [currentMem, setCurrentMem] = useState(0);
  
  function setMemsGrid ():number[][] {
    const rowsRes:number[][] = [];

    // existence checking
    if(memStates === undefined){
      return rowsRes;
    }
    if(memStates[0] === undefined){
      return rowsRes;
    }
    if(memStates[0][0] === undefined){
      return rowsRes;
    }
    //checking if memory is involved in this state
    if(memStates !== undefined && 
      memStates.length > 0){

        const currentStateGrid = memStates[val][currentMem];
        
        for (let i = 0; i < currentStateGrid.length; i+=16) {
            const tempRow = [];
            for (let j = 0; j < 16; j++) {
                if(currentStateGrid[i+j] !== undefined){
                    tempRow.push(currentStateGrid[i+j])
                }else{
                    tempRow.push(0);
                }
            }
            rowsRes.push(tempRow)
        }
      }
      return rowsRes;
  }
  function setwasmMems(wasmStores: execTypes.storeProducePatches) {
    const memBufferArrays = buildMemStatesArrays(wasmStores);
    setMemStates(memBufferArrays);
  }
  async function run(){
    const paramsCount = currentWasmType.parameters.length;
    // console.log("exports",wasmInstance.exportsTT);
    // console.log("instance",wasmInstance);
    // console.log("funcname", funcname);
    if(params.length < paramsCount){
      setShowParamsAlert(true);
      return;
    }else{
      setShowParamsAlert(false);
    }
    for (let i = 0; i < params.length; i++) {
      if(Number.isNaN(params[i])){
        setShowParamsAlert(true);
        break;
      }else{
        setShowParamsAlert(false);
      }
    }
    //assign func
    if(execToggler){
      const func = wasmInstance.exportsTT[funcname];
      const customSec:any = wasmInstance.custom;
      const res = await func(params);
      setVal(0);
      setWasmStores(res.stores);
      setwasmStates(buildStateStrings(res.stores, customSec));
      setwasmPatches(buildPatchesStrings(res.stores, wasmInstance.custom as custom[]));
      setwasmMems(res.stores);
      
    }else{
      const func = wasmInstance.exports[funcname];
      const res:number[] | bigint[] | number | bigint = await func(params);
      

      if(res instanceof Array){
        setFuncReturns(res);
      }else{
        const resArray = [];
        resArray.push(res);
        setFuncReturns(resArray);
      }
    }

    
  }

  async function instantiateModule(filename?:string):Promise<execTypes.WebAssemblyMtsInstantiatedSource>{
    // not passing filename means it's an imported wasm
    let buffer:ArrayBuffer;
    filename ? buffer = await getWasm(`${filename}.wasm`) : buffer = importedBuffer;
    
    //@ts-ignore
    const inst = await WASMMTS.instantiate(new Uint8Array(buffer));
    // console.log("inst",inst)
    return inst;
  }
  async function instantiateStoredFile(buffer:ArrayBuffer):Promise<execTypes.WebAssemblyMtsInstantiatedSource>{
    //@ts-ignore
    const inst = await WASMMTS.instantiate(new Uint8Array(buffer));
    // console.log("inst",inst)
    return inst;
  }
  

  useEffect(() => {
    if(isImportedOrDb === true){
      updateWasmImport(filename);
      setWatOpen(false);
    }else if(isImportedOrDb === false && filename !== ''){
        console.log('porco diaz')
        updateWasmExample(filename);
        setWatOpen(true);
    }else{
      setwasmStates([]);
      setWasmStores({} as execTypes.storeProducePatches);
      setwasmPatches([] as patchesDescriptor[]);
      setwatText('');
      setWasmInstance({} as execTypes.WebAssemblyMtsInstance);
      setWasmModule({} as execTypes.WebAssemblyMtsModule);
    }
  }, [filename, importedBuffer, importedName])

  return (
    <div className="App">
        <MuiTopbar/>
        <MuiInstructions
          openExamples={openExamples}
          setOpenExamples={setOpenExamples}
          setOpenStoredFiles = {setOpenStoredFiles}
        />
        <ActionButtons 
          run={run} 
          funcName={funcname}
          filename={filename}
          setFilename={setFilename}
          wasmInstance={wasmInstance}
          showParamsAlert={ShowParamsAlert}
          execToggler={execToggler}
          setExecToggler={setExecToggler}
          importedName={importedName}
          setImportedName={setImportedName}
          importedBuffer={importedBuffer}
          setImportedBuffer={setImportedBuffer}
          setWatOpen={setWatOpen}
          openExamples={openExamples}
          setOpenExamples={setOpenExamples}
          openStoredFiles={openStoredFiles}
          setOpenStoredFiles={setOpenStoredFiles}
          updateWasmStoredfile={updateWasmStoredfile}
        />
        <MuiFunctionSelector 
          setFunc={setFuncname} 
          wasmInstance={wasmInstance} 
          wasmModule={wasmModule} 
          wasmStores={wasmStores} 
          updateWasmExample={updateWasmExample} 
          setCurrentWasmType={setCurrentWasmType}
          setParamsOpen={setParamsOpen}
          importedName={importedName}
          filename={filename}
        />
        {!execToggler ? <ExecutionWrapper
          funcReturns={funcReturns}
          currentWasmType={currentWasmType}
        /> : <></>}
        <MuiEnterParams 
          currWasmType={currentWasmType} 
          params={params} 
          setParams={setParams} 
          paramsOpen={paramsOpen} 
          setParamsOpen={setParamsOpen}
        />
        <MuiCodeView 
          watText={watText}
          watOpen={watOpen}
          setWatOpen={setWatOpen}
          filename={filename}
          isImportedOrDb={isImportedOrDb}
        />
        
        {/* If time travel execution is enabled */}
        {execToggler ? <TTexecutionWrapper
          val={val} 
          setVal={setVal}
          wasmInstance={wasmInstance}
          wasmStates={wasmStates}
          watText={watText}
          memStates={memStates}
          wasmPatches={wasmPatches}
          setMemsGrid={setMemsGrid}
          currentMem={currentMem}
          setCurrentMem={setCurrentMem}
        /> : <></>}
    </div>
  );
}

// Getter functions
async function getWasm(path:string):Promise<ArrayBuffer>{
  const res:Response = await fetch(`./examples/${path}`);
  const wasmBuffer = await res.arrayBuffer();
  return wasmBuffer;
}
 
async function getWat(path:string):Promise<string>{
  const res:Response = await fetch(`./examples/${path}`);
  if(res.status === 200){
    const watText = await res.text();
    return watText;
  }else{
    return '';
  }
  
}
export default App;
