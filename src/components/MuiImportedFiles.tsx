import React, { useEffect, useRef, useState } from 'react'
import { loadAllObj, removeObj } from '../database';
import { Collapse, Container, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Padding } from '@mui/icons-material';

function MuiImportedFiles (props:{
    setIsImportedOrDb: (b:boolean) => void,
    openStoredFiles:boolean,
    setOpenStoredFiles: (b:boolean) => void,
    filename:string,
    setFilename: (f:string) => void,
    setImportedName: (f:string) => void,
    updateWasmStoredfile: (filename:string) => void,
    setImportedBuffer: (ab:ArrayBuffer) => void
}) {
    
    // mutable ref obj for the select component
    const selectRef = useRef(null);

    const [allObjects, setAllObjects] = useState([] as Blob[])
    const [allKeys, setAllKeys] = useState([] as string[])
    const [stayOpen, setStayOpen] = useState(false);

    async function updateFileList() {
        const [resAllKeys, resAllObj] = await loadAllObj();
        for (let i = 0; i < resAllKeys.length; i++) {
            resAllKeys[i] = resAllKeys[i].replace('.wasm', '');       
        }
        setAllKeys(resAllKeys);
        setAllObjects(resAllObj);
    }

    const renderValue = (selectedValue:string) => (
        <Container>
          {selectedValue}.wasm
        </Container>
    );
    
    const handleChange = async (event: SelectChangeEvent) => {
        setStayOpen(false);
        const selectedKey = event.target.value as string;
        const index = allKeys.indexOf(selectedKey);
        props.setFilename(selectedKey);
        await allObjects[index].arrayBuffer().then((buffer) => {
            console.log('arraybuffer',buffer);
            props.setImportedBuffer(buffer);
            props.setImportedName(selectedKey);
            props.setIsImportedOrDb(true);
        });
        
    
    };
    async function handleFileDelete(key:string) {
        setStayOpen(true);
        await removeObj(key +'.wasm').then( () =>{
            setStayOpen(false);
            props.setFilename('');
            props.setImportedName('');
        })
    }

    useEffect(() => {
      updateFileList().then(() => {
        console.log('keys',allKeys, allObjects)
      })
      
    }, [props.filename, stayOpen])
    
    const handleOpen = () => {
        setStayOpen(true);
    };
    const handleClose = () => {
        setStayOpen(false);
    };

  return (
    <Collapse in={props.openStoredFiles}>
        <FormControl fullWidth>
        <InputLabel id="SelectorLabel">Stored files</InputLabel>
        <Select
            ref={selectRef}
            open={stayOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            labelId="Example selector"
            id="Selector"
            value={props.filename}
            label="Function"
            onChange={handleChange}
            renderValue={renderValue}
        >
        {allKeys.map((key, i) =>
            <MenuItem value={key} sx={{ display:'flex', alignItems:'left'}}>
                <Container
                sx= {{zIndex:1}} >
                    { `${key}.wasm` }
                </Container>
                <IconButton 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        handleFileDelete(key)}}
                    sx={{ 
                        alignSelf:'flex-end',
                        zIndex:2
                    }}
                    color='error'
                    component='span'
                ><DeleteIcon sx={{zIndex:2}}/></IconButton>
            </MenuItem>
        )}
        </Select>
        </FormControl>
    </Collapse>
  )
}

export default MuiImportedFiles