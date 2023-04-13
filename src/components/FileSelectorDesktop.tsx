import '../App.css';
const fileNames = [
    'fib','arrays', 'loop', 'block', 'call', 'loadstore'
];

function FileSelectorDesktop(props:{onChange:(s:string) => void, selected:string}) {
    return (
        <div className="FileSelectorDesktop">
            <p className="SelectLabel">Select the .wat file:</p>
            <select onChange={(event)=> props.onChange(event.target.value)}  value = { props.selected }>
            <option hidden>Select a .wat file...</option>
            {fileNames.map((fileName) => (<option className='OptionFile' key={ fileName }>{ fileName }</option>))}
            </select>
        </div>
    );
  }

  export default FileSelectorDesktop;