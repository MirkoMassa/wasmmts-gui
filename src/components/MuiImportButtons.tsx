// tsx asc assembly/index.ts --target release
import { Container, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile';

const tsToWasm = 'tsx asc assembly/index.ts --target release'

function MuiImportButtons (props: {
  matches:boolean,
  handleWasmImport: (f:File) => void,
  handleTsImport: (f:File) => void,
  handleWasmToWat: (f:File) => void
}) {

  return (
  <div className='ImportButtons'>

    {/* wasm to wat BTN */}
    <label htmlFor='binary'>
    <input
      id='binary'
      type='file'
      accept="application/wasm"
      multiple
      style={{ position: 'fixed', top: '-100em' }}
      onChange={(event) => props.handleWasmToWat(event.target.files![0])}
    />
    <Tooltip title='Upload Files'>
      <IconButton size={props.matches?'large':'small'}
      color='primary'
      component='span'
      >
        .wasm<UploadFileIcon/>to .wat
      </IconButton>
    </Tooltip>
    </label>

    {/* IMPORT wasm BTN */}
    <label htmlFor='binary'>
    <input
      id='binary'
      type='file'
      accept="application/wasm"
      multiple
      style={{ position: 'fixed', top: '-100em' }}
      onChange={(event) => props.handleWasmImport(event.target.files![0])}
    />
    <Tooltip title='Upload Files'>
      <IconButton size={props.matches?'large':'small'}
      color='primary'
      component='span'
      >
        Import <UploadFileIcon/>.wasm
      </IconButton>
    </Tooltip>
  
  </label>
  {/* IMPORT ts BTN */}
  <label htmlFor='typescript'>
    <input
      id='typescript'
      type='file'
      accept=".ts"
      multiple
      style={{ position: 'fixed', top: '-100em' }}
      onChange={(event) => props.handleTsImport(event.target.files![0])}
    />
    <Tooltip title='Upload Files'>
      <IconButton size={props.matches?'large':'small'}
      color='primary'
      component='span'
      >
        Import <UploadFileIcon/>.ts
      </IconButton>
    </Tooltip>
  </label>
</div>
  )
}

export default MuiImportButtons