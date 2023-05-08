import { Avatar, Container, IconButton, Slider, Typography } from '@mui/material'
import React, { useState } from 'react'
import FastForwardIcon from '@mui/icons-material/FastForward';
import PauseIcon from '@mui/icons-material/Pause';

import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
function MuiStateSlider (props: {
      val:number, 
      setVal:(val:number) => void,
      wasmStatesLength: number, 
    }) {
    const[isRunning, setIsRunning] = useState(false);
    
    if(isRunning) {
      setTimeout(() => {
          if(props.val < props.wasmStatesLength-1) {
              props.setVal(props.val+1);
          }else{
              setIsRunning(false);
          }
          
      },200);
  }
  function changeBoolSlider() {
    const runningBool = !isRunning;
    setIsRunning(runningBool);
  }
  function playSlider() {
    changeBoolSlider();
    if(props.wasmStatesLength-1 === props.val){
        props.setVal(0);
    }
  } 
  
  function handleSliding(event: Event,
    newValue: number | number[],
    activeThumb: number,) {
      props.setVal(newValue as number)
  }

  function goBack(){
    if(props.val > 0){
      props.setVal(props.val-1);
    }
  }
  function goForward(){
    if(props.val < props.wasmStatesLength-1){
      props.setVal(props.val+1);
    }
  }


  return (
    <Container>

      <Container sx={{
          display:'flex',
          paddingX:'25px',
          paddingTop:'16px',
          gap:'20px'
          
      }}>
          <Slider min={0} max={props.wasmStatesLength-1}
           value={props.val}
           onChange={handleSliding}
          />
          {/* VAL NUMBER (default = -1, to hide it)*/}
          {props.val > -1 && <Typography variant='h6' sx={{
            marginTop:'5px'
          }}
          >{props.val}</Typography>}

          {/* PLAY BUTTON */}
          { !isRunning && <Avatar sx={{ 
            bgcolor:'#4caf50',
            marginTop:'2px'
          }}><IconButton onClick={playSlider} >
              <FastForwardIcon fontSize='large' sx={{
                  color:'black'
              }}/>
          </IconButton></Avatar>}

          {/* PAUSE BUTTON */}
          {isRunning && <Avatar sx={{ 
            bgcolor:'#b2a429',
            marginTop:'1px',
          }}><IconButton onClick={playSlider}>
              <PauseIcon fontSize='large' sx={{
                  color:'black'
              }}/>
          </IconButton></Avatar>}
          
      </Container>
      <Container sx={{
          display:'flex',
          justifyContent:'center',
          paddingX:'16px',
          paddingBottom:'16px',
          gap:'20px'}}>

          <IconButton onClick={goBack}>
              <ArrowCircleLeftOutlinedIcon 
              fontSize='large'
              sx={{
                  color:'black'
              }}/>
          </IconButton>
          <IconButton onClick={goForward}>
            <ArrowCircleRightOutlinedIcon 
            fontSize='large'
            sx={{
                color:'black'
            }}/>
        </IconButton>
      </Container>
      
    </Container>
    

  )
}

export default MuiStateSlider