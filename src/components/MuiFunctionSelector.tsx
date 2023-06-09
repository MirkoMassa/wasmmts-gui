import { Collapse, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react'
import { WebAssemblyMtsInstance } from 'wasmmts/build/src/exec/types';
import * as execTypes from 'wasmmts/build/src/exec/types'
import { Container } from '@mui/material';
import { WasmFuncType, WasmType } from 'wasmmts/build/src/exec/wasmm';
import MuiEnterParams from './MuiEnterParams';

function MuiFunctionSelector (props:{

        setFunc:(name:string)=>void, 
        wasmInstance:WebAssemblyMtsInstance,
        wasmModule:execTypes.WebAssemblyMtsModule,
        wasmStores:execTypes.storeProducePatches,
        updateWasmExample: (funcName:string) => void,
        setCurrentWasmType: (wasmType: WasmFuncType) => void,
        setParamsOpen: (b:boolean) => void,
        importedName: string,
        filename: string
    }) {
    const wasmTypes = props.wasmModule.types;
    const wasmExports = props.wasmModule.exports;
    const funcAddresses = props.wasmModule.funcs;

    const [currentLabel, setCurrentLabel] = useState('');
    const [currParamsLength, setCurrParamsLength] = useState(0);
    const [openFunctions, setOpenFunctions] = useState(false);

    const handleChange = async (event: SelectChangeEvent) => {
        props.setFunc(event.target.value);
        setCurrentLabel(event.target.value as string);
        props.setParamsOpen(true);
    };

    

      // setting number of params
   useEffect(() => {
    if(props.importedName !== '' || props.filename !== ''){
        setOpenFunctions(true);
    }
    if(wasmExports !== undefined){
        for (let i = 0; i < wasmExports.length; i++) {
            const exportInst = wasmExports[i];
            if(exportInst.valName === currentLabel){
                const funcAddress = exportInst.value.val;
                const currentFuncTypeSignature = funcAddresses[funcAddress].val;
                props.setCurrentWasmType(wasmTypes[currentFuncTypeSignature]);
                setCurrParamsLength(wasmTypes[currentFuncTypeSignature].parameters.length);
            }
        }
    }
}, [wasmExports, currentLabel, funcAddresses, wasmTypes])
      
  return (
    
    <Collapse in={openFunctions} sx={{borderTop:'1px solid lightgrey'}}>
    <Container sx={{
    paddingY:'16px',
    borderBottom:'1px solid lightgrey'
    }}>

        <FormControl fullWidth>
            
        <InputLabel id="SelectorLabel">Functions</InputLabel>
        <Select
            labelId="Function selector"
            id="Selector"
            value={currentLabel}
            label="Function"
            onChange={handleChange}
        >
        {props.wasmInstance.exportsTT && 
        Object.keys(props.wasmInstance.exportsTT).map((funcName, i) =>

            <MenuItem value={funcName}>
                { funcName }
            </MenuItem>)
        }
        </Select>
        </FormControl>
    </Container>
    </Collapse>
    
)
}

export default MuiFunctionSelector