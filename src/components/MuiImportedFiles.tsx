import React, { useEffect, useState } from 'react'
import { loadAllObj } from '../database';
import { Collapse, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

function MuiImportedFiles (props:{
    openStoredFiles:boolean,
    setOpenStoredFiles: (b:boolean) => void,
    filename:string,
    setFilename: (f:string) => void,
    setImportedName: (f:string) => void,
    updateWasmStoredfile: (filename:string, buffer:ArrayBuffer) => void

}) {
    
    const [allObjects, setAllObjects] = useState([] as Blob[])
    const [allKeys, setAllKeys] = useState([] as string[])
    async function updateFileList() {
        const [resAllKeys, resAllObj] = await loadAllObj();
        for (let i = 0; i < resAllKeys.length; i++) {
            resAllKeys[i] = resAllKeys[i].replace('.wasm', '');       
        }
        setAllKeys(resAllKeys);
        setAllObjects(resAllObj);

    }
    
    const handleChange = async (event: SelectChangeEvent) => {

        const selectedKey = event.target.value as string;
        const index = allKeys.indexOf(selectedKey);
        const file = await allObjects[index].arrayBuffer();
        console.log(file);
        props.updateWasmStoredfile(selectedKey, file);
    
    };

    useEffect(() => {
      updateFileList().then(() =>{
        console.log('keys',allKeys, allObjects)
      })
      
    }, [props.filename])
    

  return (
    <Collapse in={props.openStoredFiles}>
        <FormControl fullWidth>
        <InputLabel id="SelectorLabel">Stored files</InputLabel>
        <Select
            labelId="Example selector"
            id="Selector"
            value={props.filename}
            label="Function"
            onChange={handleChange}
        >
        {allKeys.map((key, i) =>
            <MenuItem value={key}>
                { `${key}.wasm` }
            </MenuItem>)
        }
        </Select>
        </FormControl>
    </Collapse>
  )
}

export default MuiImportedFiles