import '../App.css';
const fileNames = [
    'fib','arrays', 'loop', 'block', 'call', 'loadstore'
];

function FileSelector(props:{onChange:(s:string) => void, selected:string}) {
    return (
        <div className="FileSelector">
            <p className="SelectLabel">Select the .wat file:</p>
            <select onChange={(event)=> props.onChange(event.target.value)}  value = { props.selected }>
            <option hidden>Select a .wat file...</option>
            {fileNames.map((fileName) => (<option className='OptionFile' key={ fileName }>{ fileName }</option>))}
            </select>
        </div>
    );
  }

  export default FileSelector;