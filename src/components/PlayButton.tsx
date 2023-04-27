import '../App.css';
function PlayButton(props:{
    val:number, setVal: (val:number)=>void,
    length:number,
    intervalId: number,
    setIntervalId: (x: number) => void,
    isRunning:boolean, 
    setIsRunning: (b:boolean)=>void,
}){

    // const [intervalId, setIntervalId] = useState(0);
    // useEffect(() => {
    // }, []) 

    function changeBoolSlider() {
        const runningBool = !props.isRunning;
        props.setIsRunning(runningBool);
    }

    function playSlider() {
        changeBoolSlider();
        if(props.length === props.val){
            props.setVal(0);
        }
    }
    return (
        <div className='PlayButtonDiv'>
            {!props.isRunning && <button id="Play" className='RunBtn' onClick={playSlider}>Play slider</button>}
            {props.isRunning && <button id="Pause" className='RunBtn' onClick={playSlider}>Pause slider</button>}
        </div>
    );
  }

  export default PlayButton;