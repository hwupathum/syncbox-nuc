import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import TextField from '@mui/material/TextField';
import { base_url } from '../App';
import { useHistory, useLocation } from 'react-router-dom';
import Objectives from '../Objectives';

const LandingPage = ({ setToken }) => {
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/data/" } };
    let [isLogin, setLogin] = React.useState(true);
    let [username, setUsername] = React.useState();
    let [password, setPassword] = React.useState();
    let [error, setError] = React.useState();

    const handleSubmit = e => {
        e.preventDefault();
        setError('');
        console.log(username, password);
        axios.post(isLogin ? `${base_url}/login` : `${base_url}/register`, { username, password })
            .then(response => {
                setToken({ token: response.data, user: username });
                history.replace(from);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    }

    return (
        <>
            <Paper sx={{
                position: 'relative',
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: 'url(https://crazylogy.com/wp-content/uploads/2021/09/Cloud-Security-Everything-You-Need-To-Know--1020x600.jpeg)',
            }} >
                {<img style={{ display: 'none' }} src='https://crazylogy.com/wp-content/uploads/2021/09/Cloud-Security-Everything-You-Need-To-Know--1020x600.jpeg' alt='landing-image' />}
                <Container maxWidth="md" component="main" elevation={2}>
                    <Grid container component="main" sx={{ height: '75vh' }} sx={{ pt: 6, pb: 6 }} >
                        <Grid item xs={false} sm={4} md={7}
                            sx={{
                                backgroundImage: 'url(https://b.cloudcomputing.id/images/52e30b8a-22f0-483d-b9d1-de171e4899ca/cyber-security-lm-min.jpg)',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#cfd8dc',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square>
                            <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
                                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                                    {isLogin ? <PersonOutlineIcon /> : <PersonAddAltIcon />}
                                </Avatar>
                                <Typography component="h1" variant="h5">{isLogin ? "Login" : "Register"}</Typography>
                                {error ?? <Typography variant="p">{error}</Typography>}
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
                                    <Grid container>
                                        <Grid item>
                                            <Button variant="text" color="primary" onClick={() => setLogin(!isLogin)}>
                                                {isLogin ? "Not registered with the SyncBox? Register" : "Already registered with the SyncBox? Login"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                {/* <Grid container>
                    <Grid item md={6}>
                        <Box sx={{ position: 'relative', p: { xs: 3, md: 6 }, pr: { md: 0 }, }} >
                            <Typography component="h1" variant="h3" color="inherit" gutterBottom>SyncBox</Typography>
                            <Typography variant="h5" color="inherit" paragraph>SyncBox Description</Typography>
                            <Link variant="subtitle1" href="#">www.nextbox.lk</Link>
                        </Box>
                    </Grid>
                </Grid> */}
            </Paper>

            <Objectives />
        </>
    );
}

export default LandingPage;
