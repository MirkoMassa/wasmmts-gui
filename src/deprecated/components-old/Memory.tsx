import { memDescriptors } from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier';
import '../App.css';
import { useEffect, useState } from 'react';

function Memory(props:{
    val:number,
    // memStatesStrings:memDescriptors,
    memStates: number[][][]

}){
    const [rows, setRows] = useState([] as number[][]);
    const [currentMem, setCurrentMem] = useState(0);

    // let printMems = () => {
    //     const currMems = props.memStatesStrings[props.val];
    //     return currMems.map((mem, i) => <div>Mem id '{i}': {mem}</div>)
    // }
    let renderMemsGrid = () =>{
        if(props.memStates.length > 0){
            const currentStateGrid = props.memStates[props.val][currentMem];
            const rowsRes:number[][] = [];
            for (let i = 0; i < currentStateGrid.length; i+=16) {
                const tempRow = [];
                for (let j = 0; j < 16; j++) {
                    if(currentStateGrid[i+j] !== undefined){
                        tempRow.push(currentStateGrid[i+j])
                    }else{
                        tempRow.push(0);
                    }
                }
                rowsRes.push(tempRow)
            }
            setRows(rowsRes);
        }
    }
    
    let renderMemsSelector = ():JSX.Element[] =>{
        if(props.memStates && props.val){
            const jsxSelect:JSX.Element[] = [];
            for (let i = 0; i < props.memStates[props.val].length; i++) {
                jsxSelect.push(<option className='OptionFunc' key={i}> mem {i} </option>)
            }
            console.log(jsxSelect)
            return jsxSelect;
        }
        return [];
    }
    useEffect(() => {
        renderMemsGrid();
    
      return () => {}
    }, [props.val])
    

    return(
        <div className='MemoryDiv'>
            {/* { props.memStatesStrings && props.memStatesStrings[props.val] && <><p className='Desc'>Memory: {printMems()}</p><br /></>} */}
                        
                <select className='MemorySelector' onChange={event => {
                    setCurrentMem(parseInt(event.target.value));
                    console.log("selected mem:",currentMem);
                    }} >
                <option hidden >Select memory...</option>
                    {renderMemsSelector()}
                </select>
                <div className='TableContent'>
                    {rows.map((row) => <div className='CellsRow'>{row.map((data, id) => 
                        <div className="Cell" id={'cell'+id.toString()}>{ data < 16? '0'+data.toString(16): data.toString(16)}</div>)}</div>)}
                </div>
        </div>
    )
}

export default Memory;