import './css/profile-screen.css';
import {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../App'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import axios from 'axios';
import FormData from 'form-data';

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
    input: {
        display: 'none',
    }
  }));
  
  export const ProfileScreen =  ({ history, match }) => {
    const classes = useStyles();
    const { phone, email,nameUser, opacity, nationality, birthday, createdAt, picture, setPicture } = useContext(AuthContext);
    // console.log(birthday);
    const birthdayDate = new Date(birthday).toLocaleDateString();
    const createDate = new Date(createdAt).toLocaleDateString();

    // console.log(new Date);

    const [values, setValues] = useState({
        showOk: false,
        ok: '',
        showError: false,
        error: ''
    });
    useEffect(()  =>  {
        
        return () => {
            
        }
    }, [])
    
      function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({...values, showError: false});
    };
    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({...values, showOk: false});
    };
    const onChangeAvatar = (event) =>{
        // console.log(event);
        setPicture(URL.createObjectURL(event.target.files[0]));
        async function changeAvatar() {
            const token = localStorage.getItem('userToken');
            const formData = new FormData();
            formData.append(
                "avatar",
                event.target.files[0]
              );
            formData.append("email", email);
            
            const res = await axios.post('http://localhost:3001/users/avatar', 
                formData,
                {   
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${token}`
                    }
                });
            
            if (res.data.status === 'ok'){
              setValues({...values, ok: "Avatar modificado!", showOk: true});
              setTimeout(() => {
                history.push('/')
              }, 2000);
            }
        }
        changeAvatar();
    }
    return (
        <div id='profile-container' style={opacity}>
            {/* <TitleHome /> */}
            <div id='profile'>
                <div id="titles">
                    <div className={classes.root} id="avatar-container">
                        <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={onChangeAvatar}/>
                        <label htmlFor="icon-button-file" id="camera-icon">
                            <IconButton color="primary" aria-label="cargar imagen" component="span">
                                <PhotoCamera className="camera"/>
                            </IconButton>
                        </label>
                        {picture && <img alt={nameUser} src={picture} className="pictureProfile"/>}

                    </div>
                    <div className="item-1">Nombre usuario</div>
                    <div className="item-2">Email asociado</div>  
                    {nationality &&<div className="item-3">Nacionalidad</div>}
                    {phone && <div className="item-4">Teléfono</div>}
                    {birthday && <div className="item-5">Fecha de nacimiento</div>}
                    {createdAt && <div className="item-6">Fecha alta usuario</div>  }
                </div>
                <div id="data">
                    <div className="info-account">Tu perfil</div>
                    <div className="data-1">{nameUser}</div>
                    <div className="data-2">{email}</div>
                    <div className="data-3">{nationality}</div>
                    <div className="data-4">{phone}</div>
                    {birthday && <div className="data-5">{birthdayDate}</div>}
                    {createdAt && <div className="data-6">{createDate}</div>}
                    
                </div>
            </div>
            <>
                <Snackbar open={values.showError} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                    {values.error}
                    </Alert>
                </Snackbar>
                <Snackbar open={values.showOk} autoHideDuration={3000} onClose={handleCloseOk}>
                    <Alert onClose={handleClose} severity="success">
                    {values.ok}
                    </Alert>
                </Snackbar>
            </>
        </div>
    );
};
