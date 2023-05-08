import '../App.css';

function RunButton(props:{
    run:()=>void,
}){
    
    return(
        <div className='ButtonDiv'>
            <button className='RunBtn' onClick={props.run}>RUN</button>
        </div>
    )
}

 export default RunButton;