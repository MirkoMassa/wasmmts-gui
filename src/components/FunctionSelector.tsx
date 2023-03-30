import { WebAssemblyMtsInstance } from 'wasmmts-a_wasm_interpreter/build/src/exec/types';
import '../App.css';

function FunctionSelector(props:{run:()=>void ,watText:string, setFunc:(name:string)=>void, wasmInstance:WebAssemblyMtsInstance}) {
    return (
        <div className="functionSelector">
            <select onChange={event => props.setFunc(event.target.value)} size={10}>{props.wasmInstance.exportsTT && Object.keys(props.wasmInstance.exportsTT).map(funcName => <option key={ funcName }>{ funcName }</option>) }</select>
            <button onClick={props.run}>RUN</button>
            <pre>{props.watText}</pre>
        </div>
    );
  }

  export default FunctionSelector;