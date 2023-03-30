import '../App.css';
const fileNames = [
    'arrays', 'loop', 'block', 'fib', 'call', 'loadstore'
];

function FileSelector(props:{onChange:(s:string) => void, selected:string}) {
    return (
        <div className="FileSelector">
            <span>Select a file</span>
            <select multiple onChange={(event)=> props.onChange(event.target.value)} value = { props.selected }>
            {fileNames.map((fileName) => (<option key={ fileName }>{ fileName }</option>))}
            </select>
        </div>
    );
  }

  export default FileSelector;