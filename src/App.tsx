import React, { useState, useEffect } from 'react';
import './App.css';
import WASMMTS from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm'
import * as execTypes from 'wasmmts-a_wasm_interpreter/build/src/exec/types'
import {buildStateStrings, getCustoms, stateDescriptor} from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier'
import Slider from './components/Slider'
import FileSelector from './components/FileSelector'
import FunctionSelector from './components/FunctionSelector';
import { custom, namesVector } from 'wasmmts-a_wasm_interpreter/build/src/types';

function App() {
  const [wasmStates, setwasmStates] = useState([] as stateDescriptor[]);
  const [wasmStores, setWasmStores] = useState({} as execTypes.storeProducePatches);
  const [filename, setFilename] = useState('loop');
  const [funcname, setFuncname] = useState('');
  const [wasmInstance, setWasmInstance] = useState({} as execTypes.WebAssemblyMtsInstance);
  const [watText, setwatText] = useState("");


  async function updateWasm(filename:string){
    setFilename(filename);
    setwatText(await getWat(`${filename}.wat`));
    setWasmInstance(await instantiateModule(filename));
  }

  async function run(){
    let val = parseInt(prompt("What arguments do you want?")??"0");
    const func = wasmInstance.exportsTT[funcname];
    const customSec:any = wasmInstance.custom;
    const res = func(val);
    setWasmStores(res.stores);
    setwasmStates(buildStateStrings(res.stores, customSec));
    

  }

  // useEffect(() => {
  //   (async () => {
  //     setwasmStates(await instantiateModule(filename));
  //   })()
  // }, [])
  // currState slider
  return (
    <div className="App">
        <Slider wasmStores ={wasmStores} wasmStates={wasmStates} wasmInstance = {wasmInstance}/>
        <FileSelector onChange={updateWasm} selected={filename}/>
        <FunctionSelector run={run} watText = {watText} setFunc = {setFuncname} 
        wasmInstance = {wasmInstance}/>
    </div>
  );
}

async function instantiateModule(filename:string):Promise<execTypes.WebAssemblyMtsInstance>{
  const buffer = await getWasm(`${filename}.wasm`);
  //@ts-ignore
  const inst = await WASMMTS.instantiate(new Uint8Array(buffer)).then(result => result.instance);
  return inst;
}

async function getWasm(path:string):Promise<ArrayBuffer>{
  const res:Response = await fetch(`http://localhost:4000/wasm/${path}`);
  const wasmBuffer = await res.arrayBuffer();
  return wasmBuffer;
}

async function getWat(path:string):Promise<string>{
  const res:Response = await fetch(`http://localhost:4000/wat/${path}`);
  const watText = await res.text();
  return watText;
}

export default App;
