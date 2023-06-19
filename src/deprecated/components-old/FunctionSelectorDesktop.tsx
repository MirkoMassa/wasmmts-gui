import { WebAssemblyMtsInstance } from 'wasmmts/build/src/exec/types';
import '../App.css';

function FunctionSelectorDesktop(props:{setFunc:(name:string)=>void, wasmInstance:WebAssemblyMtsInstance, selected:string}) {
    return (
            <div className="FunctionSelectorDesktop">
                <p className="SelectLabel">Select the function:</p>            
                <select onChange={event => props.setFunc(event.target.value)} >
                    <option hidden>Select a function...</option>
                    {props.wasmInstance.exportsTT && 
                    Object.keys(props.wasmInstance.exportsTT).map(funcName => <option className='OptionFunc' key={ funcName }>{ funcName }</option>) }</select>
            </div>
    );
  }
  export default FunctionSelectorDesktop;