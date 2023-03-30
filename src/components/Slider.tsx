import React, { useEffect, useState } from 'react';
import '../App.css';
import * as execTypes from 'wasmmts-a_wasm_interpreter/build/src/exec/types'
import {stateDescriptor, descCurrentLabel, descCurrentFrame, getCustoms} from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier'
import { WebAssemblyMtsStore } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm';
import { custom } from 'wasmmts-a_wasm_interpreter/build/src/types';

function Slider(props: {wasmStores:execTypes.storeProducePatches , wasmStates: stateDescriptor[], wasmInstance:execTypes.WebAssemblyMtsInstance}) {
    const[val, setVal] = useState(0);
    const [currFrame, setCurrFrame] = useState("");

    function updateFrame(currStoreState:WebAssemblyMtsStore){
        const customs = getCustoms(props.wasmInstance.custom as custom[]);
        const currFrameDesc = descCurrentFrame(currStoreState, undefined, customs[1], customs[2]);
        console.log("aa",currFrameDesc);
        return currFrameDesc;
    }
    // useEffect(() => {
    //     (async () => {
    //         setCurrFrame(updateFrame(props.wasmStores.states[val]));
    //     })()
    // }, [])

    return (<div className="slidercontainer">
        
        {props.wasmStates[val] && props.wasmStates[val].elemDescriptors.map((elem, i) => 
            <pre key={i}>{elem.description}</pre>)}
        <div className='labfrContainer'>
            {props.wasmStores.states && props.wasmStores.states[val] && <p>Current label: {descCurrentLabel(props.wasmStores.states[val])}</p>}
            {props.wasmStores.states && props.wasmStores.states[val] && <p>Current frame: {updateFrame(props.wasmStores.states[val])}</p>}
        </div>
        <input type="range" min="0" max={props.wasmStates.length} value={val} onChange={(e) => setVal(e.target.valueAsNumber)} className="slider" id="myRange"></input>
        <pre>{(val).toString()}</pre>


        </div>)
  }

  export default Slider;