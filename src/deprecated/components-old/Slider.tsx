import React, { useState } from 'react';
import '../App.css';
import * as execTypes from 'wasmmts/build/src/exec/types'
import {stateDescriptor, descCurrentLabel, descCurrentFrame, getCustoms, patchesDescriptor, memDescriptors } from 'wasmmts/build/src/debugging/stringifier'
import { WebAssemblyMtsStore } from 'wasmmts/build/src/exec/wasmm';
import { custom } from 'wasmmts/build/src/types';
import PlayButton from './PlayButton';
import Memory from './Memory';

function Slider(props: {
    val:number, 
    setVal:(val:number) => void, 
    wasmStores:execTypes.storeProducePatches, 
    wasmPatches:patchesDescriptor[], 
    wasmStates: stateDescriptor[], 
    wasmInstance:execTypes.WebAssemblyMtsInstance, 
    watText:string,
    memStates:number[][][]
    }) {
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

    if(isRunning) {
        setTimeout(() => {
            if(props.val < props.wasmStates.length-1) {
                props.setVal(props.val+1);
            }else{
                setIsRunning(false);
            }
            
        },200);
    }
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
                { props.wasmStores.states && props.wasmStores.states[props.val] && <p className='Desc'>Current label: {descCurrentLabel(props.wasmStores.states[props.val])}</p>}
                { props.wasmStores.states && props.wasmStores.states[props.val] && <><p className='Desc'>Current frame: {updateFrame(props.wasmStores.states[props.val])}</p><br /></>}
                { props.wasmPatches &&  props.wasmPatches[props.val] && <p className='Desc'>Patches from previous state: {printPatches()}</p>}
            </div>
        </div>
        <br/>
        <div className='TwoLabels'>
            <p className="SelectLabel">WebAssembly Text Format</p>
            <p className="SelectLabel" id='memlbl'>Memory</p>
        </div>
        <div className='TextAndMem'>
            <pre className="watText">{watTextAsArray.map(row => <><span className="lineNum"></span><code>{row}</code></>)}</pre>
            <Memory val={props.val} memStates={props.memStates}/>
        </div>
    </div>)
}

  export default Slider;