import React, { useState } from 'react';
import '../App.css';
import * as execTypes from 'wasmmts-a_wasm_interpreter/build/src/exec/types'
import {stateDescriptor, descCurrentLabel, descCurrentFrame, getCustoms, patchesDescriptor} from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier'
import { WebAssemblyMtsStore } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm';
import { custom } from 'wasmmts-a_wasm_interpreter/build/src/types';

function Slider(props: {showMemory:(currState:WebAssemblyMtsStore) => void, wasmStores:execTypes.storeProducePatches , wasmPatches:patchesDescriptor[], wasmStates: stateDescriptor[], wasmInstance:execTypes.WebAssemblyMtsInstance, watText:string}) {
    const[val, setVal] = useState(0);
    // console.log(props.wasmStates, val);
    const watTextAsArray = props.watText.split('\n');
    if(props.wasmStates.length<val){
        setVal(0);
    }

    function updateFrame(currStoreState:WebAssemblyMtsStore){
        const customs = getCustoms(props.wasmInstance.custom as custom[]);
        // console.log("customs",customs)
        // console.log("curr",currStoreState)
        const currFrameDesc = descCurrentFrame(currStoreState, undefined, customs[1], customs[2]);
        return currFrameDesc;
    }
    let printPatches = () => {
        return props.wasmPatches[val].description.map(desc => <div>{desc}</div>)
    }
    let printMem = () => {
        return props.wasmStores.states[val].mems.map((mem, i) => <div>MEM {i.toString()} {mem.data.toString()}</div>)
    }
    // useEffect(() => {
    //     (async () => {
    //         setCurrFrame(updateFrame(props.wasmStores.states[val]));
    //     })()
    // }, [])

    return (<div className="ResultSection">
                <br /><p className='StackLabel'>Stack</p>
                <div className='Slidercontainer'>
                    {props.wasmStates[val] && props.wasmStates[val].elemDescriptors.map((elem, i) => 
                    <pre className = "Description" key={i}>{elem.description}</pre>)}
                    <input className="Slider" type="range" min="0" max={props.wasmStates.length} value={val} onChange={(e) => setVal(e.target.valueAsNumber) } id="myRange"></input>
                    <pre className='StateVal'>State: {(val).toString()}</pre>
                    <div className='labfrContainer'>
                        {props.wasmStores.states && props.wasmStores.states[val] && <p className='Desc'>Current label: {descCurrentLabel(props.wasmStores.states[val])}</p>}
                        { props.wasmStores.states && props.wasmStores.states[val] && <><p className='Desc'>Current frame: {updateFrame(props.wasmStores.states[val])}</p><br /></>}
                        { props.wasmPatches &&  props.wasmPatches[val] && <p className='Desc'>Patches from previous state: {printPatches()}</p>}
                    </div>
                    
                    </div>
                <br/><p className="SelectLabel"> WebAssembly Text Format </p>
                <br/><pre className="watText">{watTextAsArray.map(row => <><span className="lineNum"></span><code>{row}</code></>)}</pre>
            </div>)
}

  export default Slider;