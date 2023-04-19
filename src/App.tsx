import React, { useState } from 'react';
import './App.css';
import WASMMTS, { WebAssemblyMtsStore } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm'
import * as execTypes from 'wasmmts-a_wasm_interpreter/build/src/exec/types'
import {buildStateStrings, patchesDescriptor, stateDescriptor, buildPatchesStrings} from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier'
import Slider from './components/Slider'
import FileSelector from './components/FileSelector'
import FileSelectorDesktop from './components/FileSelectorDesktop'
import FunctionSelector from './components/FunctionSelector';
import FunctionSelectorDesktop from './components/FunctionSelectorDesktop';
import RunButton from './components/RunButton';
import { custom } from 'wasmmts-a_wasm_interpreter/build/src/types';
import Topbar from './components/Topbar';

function App() {
  const [wasmStates, setwasmStates] = useState([] as stateDescriptor[]);
  const [wasmStores, setWasmStores] = useState({} as execTypes.storeProducePatches);
  const [filename, setFilename] = useState('');
  const [funcname, setFuncname] = useState('');
  const [wasmInstance, setWasmInstance] = useState({} as execTypes.WebAssemblyMtsInstance);
  const [watText, setwatText] = useState("");
  const [wasmPatches, setwasmPatches] = useState([] as patchesDescriptor[]);
  const[val, setVal] = useState(0);

  async function updateWasm(filename:string){
    setwasmStates([]);
    setWasmStores({} as execTypes.storeProducePatches);
    setwasmPatches([] as patchesDescriptor[]);
    setFilename(filename);
    setwatText(await getWat(`${filename}.wat`));
    setWasmInstance(await instantiateModule(filename));
  }

  async function run(){
    // console.log("exports",wasmInstance.exportsTT);
    // console.log("instance",wasmInstance);
    // console.log("funcname", funcname);
    const func = wasmInstance.exportsTT[funcname];
    const customSec:any = wasmInstance.custom;
    let params:number[] = [];

    let strVal = prompt("Enter args in this old style prompt! (separate multiple vals with ',')")??"0";

    if(!strVal.includes(',')) {
      params.push(parseInt(strVal));
    }else{
      const args = strVal.split(",");
      for (let i = 0; i < args.length; i++) {
        params.push(parseInt(args[i]));
      }
    }
    
    const res = await func(params);
    setWasmStores(res.stores);
    setwasmStates(buildStateStrings(res.stores, customSec));
    setwasmPatches(buildPatchesStrings(res.stores, wasmInstance.custom as custom[]));
  }
  async function slide(interval:number = 500, length:number){
    await run();
    for (let i = 0; i < length; i++) {
      setInterval(() =>{

      }, interval)
    }
    
  }

  // useEffect(() => {
  //   (async () => {
  //     setwasmStates(await instantiateModule(filename));
  //   })()
  // }, [])
  // currState slider
  return (
    <div className="App">
      <Topbar/>
      <div className='WasmMTS_demo'>
        <FileSelector onChange={updateWasm} selected={filename}/>
        <FileSelectorDesktop onChange={updateWasm} selected={filename}/>
        <FunctionSelector setFunc = {setFuncname} 
        wasmInstance = {wasmInstance} selected= {funcname}/>
        <FunctionSelectorDesktop setFunc = {setFuncname} 
        wasmInstance = {wasmInstance} selected= {funcname}/>
        <RunButton run={run}/>
        <Slider val={val} setVal={setVal} showMemory= {showMemory} wasmStores ={wasmStores} wasmPatches = {wasmPatches} wasmStates={wasmStates} wasmInstance = {wasmInstance} watText = {watText}/>
      </div>
    </div>
  );
}

async function instantiateModule(filename:string):Promise<execTypes.WebAssemblyMtsInstance>{
  const buffer = await getWasm(`${filename}.wasm`);
  //@ts-ignore
  const inst = await WASMMTS.instantiate(new Uint8Array(buffer));
  console.log("inst",inst)
  return inst.instance;
}

async function getWasm(path:string):Promise<ArrayBuffer>{
  const res:Response = await fetch(`./wasm/${path}`);
  const wasmBuffer = await res.arrayBuffer();
  return wasmBuffer;
}
 
async function getWat(path:string):Promise<string>{
  const res:Response = await fetch(`./wat/${path}`);
  const watText = await res.text();
  return watText;
}

function showMemory(currStore:WebAssemblyMtsStore):void{
  const mem = currStore.takeMem().data.toString();
  alert(mem);
}

export default App;
