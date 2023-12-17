import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Divider from '@mui/material/Divider';
import { NavbarItems } from '../utils/NavbarItems';
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getRole, tokenValid } from '../utils/Auth';



export default function TopBar({company}) {
   
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


    const path = useLocation();
    if (path.pathname.includes("login"))
        return null;

    if(!tokenValid())
        return null;


    return (


        <AppBar position="fixed">
            <Container maxWidth="l">
                <Toolbar>
                    <AllInboxIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'inherit',
                            fontWeight: 700,
                            letterSpacing: '.3rem',


                            textAlign: 'center'
                        }}
                    >
                        Warehelper
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} >
                        <AllInboxIcon sx={{ mr: 1 }} />
                        <Typography
                            variant="h5"

                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'inherit',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            
                            Warehelper
                        </Typography>
                        <IconButton
                            size="large"

                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            justifyContent="flex-end"
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                             {NavbarItems.filter((page) => ( page.role.includes(getRole()) && ((page.requires.includes("company") && company) || !(page.requires.includes("company") )))
                            ).map((page) => (
                                <MenuItem key={page.id} onClick={handleCloseNavMenu} component={Link} to={page.route}>

                                    <Typography textAlign="center">{page.title}</Typography>

                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} justifyContent="flex-end">

                        {NavbarItems.filter((page) => (  page.role.includes(getRole())&& ((page.requires.includes("company") && company) || !(page.requires.includes("company") )))
                        ).map((page) => (
                           
                            <Button
                                key={page.id}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'inherit', display: 'block' }}
                                component={Link} to={page.route}
                            >
                                {page.title}
                            
                            </Button>
                          
                        ))}


                    </Box>


                </Toolbar>
            </Container>
        </AppBar>
    );
}
