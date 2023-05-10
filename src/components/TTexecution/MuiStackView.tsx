import { Container, Typography } from '@mui/material'
import LayersIcon from '@mui/icons-material/Layers';
import * as execTypes from 'wasmmts-a_wasm_interpreter/build/src/exec/types'
import {stateDescriptor, descCurrentLabel, descCurrentFrame, getCustoms, patchesDescriptor, memDescriptors } from 'wasmmts-a_wasm_interpreter/build/src/debugging/stringifier'
import { WebAssemblyMtsStore } from 'wasmmts-a_wasm_interpreter/build/src/exec/wasmm';
import { custom } from 'wasmmts-a_wasm_interpreter/build/src/types';
import MuiStateSlider from './MuiStateSlider';

function MuiStackView(props: {
        val:number,
        setVal:(val:number) => void,
        wasmStates: stateDescriptor[],
        wasmStatesLength:number,
        wasmInstance:execTypes.WebAssemblyMtsInstance, 
        watText:string,
        memStates:number[][][]
    }) {

    function updateFrame(currStoreState:WebAssemblyMtsStore){
        const customs = getCustoms(props.wasmInstance.custom as custom[]);
        // console.log("customs",customs)
        // console.log("curr",currStoreState)
        const currFrameDesc = descCurrentFrame(currStoreState, undefined, customs[1], customs[2]);
        return currFrameDesc;
    }

  return (
    <Container sx={{
      paddingY:'16px',
      borderBottom:'1px solid lightgrey',
      maxHeight:'60vh'
      }}>
        <MuiStateSlider 
          val={props.val} 
          setVal={props.setVal} 
          wasmStatesLength={props.wasmStatesLength}
        />
        
        <Typography variant="h5" align='center'>
        <LayersIcon/> Stack <LayersIcon/> 
        </Typography>
        <Container sx={{
          paddingY:'16px',
          borderBottom:'1px solid lightgrey',
          maxHeight:'40vh',
          overflowY:'scroll'
        }}>
        
        {props.wasmStates[props.val] && props.wasmStates[props.val].elemDescriptors.map((elem, i) => 
            <Typography variant="subtitle1"
              sx={{
                border:'2px solid grey',
                paddingY:'5px'
              }}
            >{elem.description}</Typography>)}
        </Container>
        
        
    </Container>
  )
}

export default MuiStackView