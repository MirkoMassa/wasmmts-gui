import { WebAssemblyMtsInstance } from 'wasmmts-a_wasm_interpreter/build/src/exec/types';
import '../App.css';

function FunctionSelector(props:{run:()=>void ,watText:string, setFunc:(name:string)=>void, wasmInstance:WebAssemblyMtsInstance}) {
    return (
        <div className="FunctionSelector">
            <p className="SelectLabel">Select the function</p>
            <div className='SelectorContainer'>
                <select onChange={event => props.setFunc(event.target.value)} size={10}>{props.wasmInstance.exportsTT && 
                    Object.keys(props.wasmInstance.exportsTT).map(funcName => <option className='OptionFunc' key={ funcName }>{ funcName }</option>) }</select>
            </div>
            <button className='RunBtn' onClick={props.run}>RUN</button>
            <pre className="watText">\/ Text Format \/<br/><br/>{props.watText}</pre>
        </div>
    );
  }

  export default FunctionSelector;