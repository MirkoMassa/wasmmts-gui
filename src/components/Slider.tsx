import React, { useState, useEffect } from 'react';
import '../App.css';
import * as execTypes from 'wasmmts-a_wasm_interpreter/build/src/exec/types'
import {stateDescriptor, descCurrentLabel, descCurrentFrame, getCustoms, patchesDescriptor} from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier'
import { WebAssemblyMtsStore } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm';
import { custom } from 'wasmmts-a_wasm_interpreter/build/src/types';
import PlayButton from './PlayButton';

function Slider(props: {showMemory:(currState:WebAssemblyMtsStore) => void, val:number, setVal:(val:number) => void, wasmStores:execTypes.storeProducePatches , wasmPatches:patchesDescriptor[], wasmStates: stateDescriptor[], wasmInstance:execTypes.WebAssemblyMtsInstance, watText:string}) {
    // const[val, setVal] = useState(0);
    const[isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(0);
    // console.log(props.wasmStates, val);
    const watTextAsArray = props.watText.split('\n');
    if(props.wasmStates.length<props.val){
        props.setVal(0);
    }

    function updateFrame(currStoreState:WebAssemblyMtsStore){
        const customs = getCustoms(props.wasmInstance.custom as custom[]);
        // console.log("customs",customs)
        // console.log("curr",currStoreState)
        const currFrameDesc = descCurrentFrame(currStoreState, undefined, customs[1], customs[2]);
        return currFrameDesc;
    }
    let printPatches = () => {
        return props.wasmPatches[props.val].description.map(desc => <div>{desc}</div>)
    }
    let printMem = () => {
        return props.wasmStores.states[props.val].mems.map((mem, i) => <div>MEM {i.toString()} {mem.data.toString()}</div>)
    }

    if(isRunning) {
        setTimeout(() => {
            if(props.val < props.wasmStates.length-1) {
                props.setVal(props.val+1);
            }else{
                setIsRunning(false);
            }
            
        },200);
    }

    // const sliderElement = document.getElementById("slidey")!;
    // useEffect(() => {
    //     (async () => {
    //         setCurrFrame(updateFrame(props.wasmStores.states[val]));
    //     })()
    // }, [])

    return (<div className="ResultSection">
                    <PlayButton 
                        val={props.val} setVal={props.setVal} length={props.wasmStates.length-1} 
                        intervalId={intervalId} setIntervalId={setIntervalId}
                        isRunning={isRunning} setIsRunning={setIsRunning}
                    />
                    <p className='StackLabel'>Stack</p>

                
                <div className='Slidercontainer'>
                    {props.wasmStates[props.val] && props.wasmStates[props.val].elemDescriptors.map((elem, i) => 
                    <pre className = "Description" key={i}>{elem.description}</pre>)}
                    <input id="slidey" className="Slider" type="range" min="0" max={props.wasmStates.length-1} value={props.val} onChange={(e) => props.setVal(e.target.valueAsNumber) }></input>
                        <pre className='StateVal'>State: {(props.val).toString()}</pre>
                    
                    <div className='labfrContainer'>
                        {props.wasmStores.states && props.wasmStores.states[props.val] && <p className='Desc'>Current label: {descCurrentLabel(props.wasmStores.states[props.val])}</p>}
                        { props.wasmStores.states && props.wasmStores.states[props.val] && <><p className='Desc'>Current frame: {updateFrame(props.wasmStores.states[props.val])}</p><br /></>}
                        { props.wasmPatches &&  props.wasmPatches[props.val] && <p className='Desc'>Patches from previous state: {printPatches()}</p>}
                    </div>
                </div>
                <br/><p className="SelectLabel">WebAssembly Text Format</p>
                <br/><pre className="watText">{watTextAsArray.map(row => <><span className="lineNum"></span><code>{row}</code></>)}</pre>
            </div>)
}

  export default Slider;