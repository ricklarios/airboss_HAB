import { React, useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { AuthContext } from '../../App';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';

export default function SimpleMenu() {

  const { nameUser, setLogin, picture } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
    }));

    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccount = () => {
        // al fijar setAnchorEl con null se oculta el menú
        setAnchorEl(null);
        history.push('/profile/');
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('typeAuth');
        localStorage.removeItem('idUser');
        setLogin(false);
        setAnchorEl(null);
        history.push('/');
    };

    return (
        <div>
            <Button
                aria-controls='simple-menu'
                aria-haspopup='true'
                onClick={handleClick}
            >
                <Avatar
                    alt={nameUser}
                    src={picture}
                    className={classes.rounded}
                />{' '}
                {nameUser}
            </Button>
            <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleAccount}>Mi cuenta</MenuItem>
                <MenuItem onClick={handleClose}>Mis Vuelos</MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon />
                    Salir
                </MenuItem>
            </Menu>
        </div>
    );
}
