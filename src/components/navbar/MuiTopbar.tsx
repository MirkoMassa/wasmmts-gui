import { AppBar, Box, Container, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react'

const MuiTopbar = () => {
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
                {/* @ts-ignore */}
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