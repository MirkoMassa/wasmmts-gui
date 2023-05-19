import { AppBar, Box, Container, Drawer, IconButton, Stack, Toolbar, Typography, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react'

const MuiTopbar = () => {
    const matches = useMediaQuery('(min-width:600px)');
    
    const [open, setOpen] = useState(false);

    const toggleDrawer = (open:boolean) => (event:KeyboardEvent) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setOpen(open);
      };
      
    return (
            <AppBar position="static" sx={{width:'100%'}}>
            <Toolbar>
                {/* @ts-ignore */}
                <IconButton  
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer(true)}
                    sx={{ mr: 3, display: { xs: 'block', sm: 'none',}, flexGrow:'1'}}
                >
                <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 10 }} marginBottom='6px'>
                    WasmMTS
                </Typography>
                
                {/* desktop view icons */}
                {matches? <Container disableGutters sx={{
                        display:'flex',
                        justifyContent:'flex-end',
                        width:'100%',
                        flexWrap: 'wrap',
                        columnGap:'30px'
                    }}>

                    <IconButton href='https://docs.google.com/document/d/e/2PACX-1vShG5TFQLA4wdsj1dB1GGFBZc9x0LA5D9HsrdBWBgHPkZrCABtmS1rinMDDvjmLPU6hTBt_djT5g0aR/pub'
                    sx={{color: '#FAFAFA'}}>
                    <PersonIcon htmlColor='#FAFAFA' fontSize='large'/>My Resume
                    </IconButton>

                    <IconButton href='https://github.com/MirkoMassa/wasmmTS' sx={{
                        color: '#FAFAFA'
                    }}>
                        <GitHubIcon htmlColor='#FAFAFA' fontSize='large'/>GitHub
                    </IconButton>
                    <IconButton href='https://www.linkedin.com/in/mirko-massa' sx={{
                        color: '#FAFAFA'
                    }}>
                        <LinkedInIcon htmlColor='#FAFAFA' fontSize='large'/>LinkedIn
                    </IconButton>
                    <img src={require("../../images/logo.png")} alt="logo"/>
                </Container> : <></>}

                <IconButton 
                    edge='end'
                    sx={{ mr: 2, display: { xs: 'block', sm: 'none',}, }}
                >   
                <img src={require("../../images/logo.png")} alt="logo"/>
                </IconButton>

                <Drawer
                anchor="left"
                variant="temporary"
                
                open={open}
                onClose={toggleDrawer(false)}
                /* @ts-ignore */
                onOpen={toggleDrawer(true)}
                >

                    <Stack direction='column' justifyContent='center'
                    sx={{ paddingX:'3vw' }}
                    >
                        {/* @ts-ignore */}
                        <IconButton sx={{
                            width:'100%'
                        }} onClick={toggleDrawer(false)}>
                        <CloseIcon />
                        </IconButton>

                        <IconButton href='https://docs.google.com/document/d/e/2PACX-1vQ1sQbEurwEdNqOhjkcGRZwySb0gczGsSgIoZpNgyngGI11ZZMfywf0OZzNklt-Qa15yKSv54otZ8sJ/pub'
                        sx={{color: 'black'}}>
                        <PersonIcon htmlColor='black' fontSize='large'/>My Resume
                        </IconButton>
                        <IconButton href='https://github.com/MirkoMassa/wasmmTS' sx={{
                            color: 'black'
                        }}>
                            <GitHubIcon htmlColor='black' fontSize='large'/>GitHub
                        </IconButton>
                        <IconButton href='https://www.linkedin.com/in/mirko-massa' sx={{
                            color: '#0e76a8'
                        }}>
                            <LinkedInIcon htmlColor='#0e76a8' fontSize='large'/>LinkedIn
                        </IconButton>
                    </Stack>
                </Drawer>
            </Toolbar>
        </AppBar>
    )
}

export default MuiTopbar