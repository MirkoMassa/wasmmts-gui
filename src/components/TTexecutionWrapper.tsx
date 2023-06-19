import { Container } from '@mui/material'
import React from 'react'
import MuiStackView from './TTexecution/MuiStackView'
import MuiPatchesView from './TTexecution/MuiPatchesView'
import MuiMemView from './TTexecution/MuiMemView'
import { WebAssemblyMtsInstance } from 'wasmmts/build/src/exec/types'
import { patchesDescriptor, stateDescriptor } from 'wasmmts/build/src/debugging/stringifier'

function TTexecutionWrapper (props:{
        val:number, 
        setVal:(val:number) => void,

        wasmInstance:WebAssemblyMtsInstance,
        wasmStates:stateDescriptor[],
        watText:string,
        memStates:number[][][],
        wasmPatches: patchesDescriptor[],

        setMemsGrid:()=>number[][],
        currentMem:number,
        setCurrentMem:(n:number)=>void,

    }) {


  return (
    <Container>
        <MuiStackView 
            val={props.val} 
            setVal={props.setVal}
            wasmStatesLength={props.wasmStates.length} 
            wasmStates={props.wasmStates} 
            wasmInstance={props.wasmInstance} 
            watText={props.watText} 
            memStates={props.memStates}
            />
        <MuiPatchesView 
            wasmPatches={props.wasmPatches} 
            val={props.val}
        />
        <MuiMemView 
            memStates={props.memStates} 
            setMemsGrid={props.setMemsGrid}
            currentMem={props.currentMem}
            setCurrentMem={props.setCurrentMem}
            val={props.val} 
        />
    </Container>
  )
}

export default TTexecutionWrapper