import { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { base_url } from '../App';
import { useHistory, useLocation } from 'react-router-dom';

const AuthPage = ({ setToken }) => {
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/data/" } };
    let [username, setUsername] = useState();
    let [password, setPassword] = useState();
    let [error, setError] = useState();
    let [isLogin, setLogin] = useState(true);

    const handleSubmit = e => {
        e.preventDefault();
        setError('');

        axios.post(isLogin ? `${base_url}/users/login` : `${base_url}/users/register`, { username, password })
            .then(response => {
                if (response.data?.status === 200) {
                    setToken({ token: response.data.data, user: username });
                    history.replace(from);
                } else {
                    console.error(new Error(response.data?.message));
                    setError(response.data?.message);
                }
            })
            .catch(error => {
                console.log(error.message);
                console.error(error);
                setError(error.error);
            });
    }

    return (
        <>
            <Grid container sx={{ height: '75vh' }} justifyContent="center" alignItems={"center"}>
                <Grid item xs={12} md={6} style={{ maxWidth: 400 }} component={Paper}>
                    <Box sx={{ my: 6, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            {isLogin ? <PersonOutlineIcon /> : <PersonAddAltIcon />}
                        </Avatar>
                        <Typography component="h1" variant="h5">{isLogin ? "Log In" : "Register"}</Typography>
                        {error ? (<Alert sx={{ mt: 0, mb: 0 }} severity="error"  >{error}</Alert>) : (<></>)}
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                autoComplete="username"
                                autoFocus
                                onChange={e => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                onChange={e => setPassword(e.target.value)}
                            />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} >{isLogin ? "Login" : "Register"}</Button>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Button variant="text" color="primary" onClick={() => setLogin(!isLogin)} fullWidth>
                                        {isLogin ? "Not registered with the SyncBox?" : "Already registered with the SyncBox?"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default AuthPage;
