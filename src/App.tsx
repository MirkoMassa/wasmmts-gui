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
import MuiStackView from './components/MuiStackView';
import MuiStateSlider from './components/MuiStateSlider';
import MuiEnterParams from './components/MuiEnterParams';
import { Alert, Collapse, Container, IconButton } from '@mui/material';
import MuiParamsAltert from './components/alterts/MuiParamsAlert';
import MuiParamsAlert from './components/alterts/MuiParamsAlert';
import MuiInstructions from './components/MuiInstructions';
import MuiPatchesView from './components/MuiPatchesView';
import MuiMemView from './components/MuiMemView';


function App() {
  const [wasmStates, setwasmStates] = useState([] as stateDescriptor[]);
  const [wasmStores, setWasmStores] = useState({} as execTypes.storeProducePatches);

  const [memStates, setMemStates] = useState([] as number[][][]);
  const [memStatesStrings, setMemStatesStrings] = useState([] as memDescriptors);

  const [filename, setFilename] = useState('');
  const [funcname, setFuncname] = useState('');
  const [wasmInstance, setWasmInstance] = useState({} as execTypes.WebAssemblyMtsInstance);
  const [wasmModule, setWasmModule] = useState({} as execTypes.WebAssemblyMtsModule);
  const [watText, setwatText] = useState('');
  const [wasmPatches, setwasmPatches] = useState([] as patchesDescriptor[]);
  const [val, setVal] = useState(-1);

  const [currentWasmType, setCurrentWasmType] = useState({} as WasmFuncType);
  const [params, setParams] = useState([] as number[]);


  async function updateWasm(filename:string){
    setwasmStates([]);
    setWasmStores({} as execTypes.storeProducePatches);
    setwasmPatches([] as patchesDescriptor[]);
    setFilename(filename);
    setwatText(await getWat(`${filename}.wat`));
    const instSource = await instantiateModule(filename)
    setWasmInstance(instSource.instance);
    setWasmModule(instSource.module);
  }

  // Collapsers hooks
  const [ShowParamsAlert, setShowParamsAlert] = useState(false);
  const [watOpen, setWatOpen] = useState(false);
  const [paramsOpen, setParamsOpen] = useState(false);

  async function run(){
    const paramsCount = currentWasmType.parameters.length;
    // console.log("exports",wasmInstance.exportsTT);
    // console.log("instance",wasmInstance);
    // console.log("funcname", funcname);
    console.log(params.length, paramsCount);
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
    const func = wasmInstance.exportsTT[funcname];
    const customSec:any = wasmInstance.custom;

    const res = await func(params);
    setWasmStores(res.stores);
    setwasmStates(buildStateStrings(res.stores, customSec));
    setwasmPatches(buildPatchesStrings(res.stores, wasmInstance.custom as custom[]));
    setwasmMemsStrings(res.stores);
    setwasmMems(res.stores);
    setVal(0);
  }

  function setwasmMemsStrings(wasmStores: execTypes.storeProducePatches) {
    const memBufferStrings = buildMemStatesStrings(wasmStores);
    setMemStatesStrings(memBufferStrings);
  }
  function setwasmMems(wasmStores: execTypes.storeProducePatches) {
    const memBufferArrays = buildMemStatesArrays(wasmStores);
    setMemStates(memBufferArrays);
  }

  useEffect(() => {
    if(filename !== ''){
      updateWasm(filename);
      setWatOpen(true);
    }
    

  }, [filename])

  return (
    <div className="App">
        <MuiTopbar/>
        
        <ActionButtons 
          run={run} 
          setwatText={setwatText} 
          funcName={funcname}
          filename={filename}
          setFilename={setFilename}
          wasmInstance={wasmInstance}
          showParamsAlert={ShowParamsAlert}/>
        <MuiInstructions/>
        <MuiFunctionSelector 
          setFunc={setFuncname} 
          wasmInstance={wasmInstance} 
          wasmModule={wasmModule} 
          wasmStores={wasmStores} 
          updateWasm={updateWasm} 
          setCurrentWasmType={setCurrentWasmType}
          setParamsOpen={setParamsOpen}
          />
        <MuiEnterParams currWasmType={currentWasmType} params={params} setParams={setParams} paramsOpen={paramsOpen} setParamsOpen={setParamsOpen}/>
        <MuiCodeView watText={watText} watOpen={watOpen} setWatOpen={setWatOpen}/>
        <MuiStackView 
          val={val} 
          setVal={setVal}
          wasmStatesLength={wasmStates.length} 
          wasmStates={wasmStates} 
          wasmInstance={wasmInstance} 
          watText={watText} 
          memStates={memStates}/>
        <MuiPatchesView 
          wasmPatches={wasmPatches} 
          val={val}/>
        <MuiMemView/>
    </div>
  );
}

async function instantiateModule(filename:string):Promise<execTypes.WebAssemblyMtsInstantiatedSource>{
  const buffer = await getWasm(`${filename}.wasm`);
  //@ts-ignore
  const inst = await WASMMTS.instantiate(new Uint8Array(buffer));
  console.log("inst",inst)
  return inst;
}

async function getWasm(path:string):Promise<ArrayBuffer>{
  const res:Response = await fetch(`./examples/${path}`);
  const wasmBuffer = await res.arrayBuffer();
  return wasmBuffer;
}
 
async function getWat(path:string):Promise<string>{
  const res:Response = await fetch(`./examples/${path}`);
  const watText = await res.text();
  return watText;
}
export default App;
