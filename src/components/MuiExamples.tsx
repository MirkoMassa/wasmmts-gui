import { Collapse, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

const exampleNames = ['call', 'fib', 'ifelsenest', 'loadstore', 'loop', 'multiArgs', 'sum'];


function MuiExamples (props:{
    openExamples:boolean,
    filename: string,
    setFilename: (f:string) => void,
    setImportedName: (f:string) => void
}) {    
    const handleChange = async (event: SelectChangeEvent) => {
        props.setFilename(event.target.value as string);
        props.setImportedName('');
    };
    return (
    <Collapse in={props.openExamples}>
        <FormControl fullWidth>
        <InputLabel id="SelectorLabel">Examples</InputLabel>
        <Select
            labelId="Example selector"
            id="Selector"
            value={props.filename}
            label="Function"
            onChange={handleChange}
        >
        {exampleNames.map((fileName, i) =>

            <MenuItem value={fileName}>
                { fileName }
            </MenuItem>)
        }
        </Select>
        </FormControl>
    </Collapse>
  )
}

export default MuiExamples