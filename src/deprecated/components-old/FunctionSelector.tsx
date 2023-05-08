import { WebAssemblyMtsInstance } from 'wasmmts-a_wasm_interpreter/build/src/exec/types';
import '../App.css';

function FunctionSelector(props:{setFunc:(name:string)=>void, wasmInstance:WebAssemblyMtsInstance, selected:string}) {
    return (
            <div className="FunctionSelector">
                <p className="SelectLabel">Select the function:</p>            
                <select onChange={event => props.setFunc(event.target.value)} >
                    <option hidden>Select a function...</option>
                    {props.wasmInstance.exportsTT && 
                    Object.keys(props.wasmInstance.exportsTT).map(funcName => <option className='OptionFunc' key={ funcName }>{ funcName }</option>) }</select>
            </div>
    );
  }

  export default FunctionSelector;