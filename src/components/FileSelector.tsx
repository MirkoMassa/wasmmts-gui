import '../App.css';
const fileNames = [
    'arrays', 'loop', 'block', 'fib', 'call', 'loadstore'
];

function FileSelector(props:{onChange:(s:string) => void, selected:string}) {
    return (
        <div className="FileSelector">
            <img src={require("../images/logo.png")} alt="logo" width="325" height="325"/>
            <p className="SelectLabel">Select the WebAssembly file</p>
            <select multiple onChange={(event)=> props.onChange(event.target.value)} value = { props.selected }>
            {fileNames.map((fileName) => (<option className='OptionFile' key={ fileName }>{ fileName }</option>))}
            </select>
        </div>
    );
  }

  export default FileSelector;