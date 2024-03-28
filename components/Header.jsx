import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/context';
import logo from '../images/TOALL.png'

export default function Navbar() {
    const { token, setToken, claim, setClaim } = useMyContext();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const { token: authToken,managerDataSummary,setmanagerDataSummary } = useMyContext();

    // console.log(managerDataSummary.imageData);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setToken(null);
        setClaim(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('claim');
        navigate('/managerlogin');
        handleMenuClose(); // Menüyü kapat
    };

    // Token değeri varsa logout, yoksa login butonunu göster
    const renderAuthButton = () => {
        if (token) {
            return (
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        color="inherit"
                    >
                        
                            {/* <Avatar src={`data:image/jpeg;base64,${managerDataSummary.imageData}`} /> */}
                            {managerDataSummary && managerDataSummary.imageData && (
                                                        <Avatar src={`data:image/jpeg;base64,${managerDataSummary.imageData}`} />
                                                        )}


                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose} component={Link} to="/detail">Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            );
        } else {
            return (
                <Button color="inherit" component={Link} to="/managerlogin">
                    Login
                </Button>
            );
        }
    };

    return (
        <AppBar position="fixed">
            <Container>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                       
                        <Link
                        style={{color:'white'}}
                         to="/summary"
                        >
                             <img 
                        style={{width:'5%', height:'5%'}}
                        src={logo}></img>
                        Human Resources TO ALL
                        </Link>

                    </Typography>
                    {renderAuthButton()}
                </Toolbar>
            </Container>
        </AppBar>
    );
}


