import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Container from '@mui/material/Container';

// function Copyright(props) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright © '}
//             <Link color="inherit" href="https://mui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

const tiers = [
    {
        title: 'Minimal Disruptions',
        price: '0',
        description: ['Minimize cloud service disruptions on unreliable Internet connections'],
        icon: <CloudSyncIcon />
    },
    {
        title: 'Save Money',
        price: '30',
        description: ['Reduce the cost of internet consumption of cloud services during rush hours'],
        icon: <MonetizationOnIcon />
    },
    {
        title: 'Globally Aceessible',
        price: '30',
        description: ['Make the system accessible for client devices using a standard protocol'],
        icon: <TipsAndUpdatesIcon />
    },
    {
        title: 'Fast Speed',
        price: '15',
        description: ['Improve the cloud access speed in using cloud services'],
        icon: <SignalCellularAltIcon />
    },
];

// const footers = [
//     {
//         title: 'Company',
//         description: ['Team', 'History', 'Contact us', 'Locations'],
//     },
//     {
//         title: 'Features',
//         description: [
//             'Cool stuff',
//             'Random feature',
//             'Team feature',
//             'Developer stuff',
//             'Another one',
//         ],
//     },
//     {
//         title: 'Resources',
//         description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
//     },
//     {
//         title: 'Legal',
//         description: ['Privacy policy', 'Terms of use'],
//     },
// ];

const Objectives = () => {
    return (
        <>
            <Container maxWidth="md" component="footer" sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, mt: 6, pb: 8 }} />
            <Container disableGutters maxWidth="sm" component="main" sx={{ pb: 6 }}>
                <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom >SyncBox Features</Typography>
                <Typography variant="h5" align="center" color="text.secondary" component="p">
                    TODO: Quickly build an effective pricing table for your potential customers with
                    this layout. It&apos;s built with default MUI components with little
                    customization.
                </Typography>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main" sx={{ mb: 12 }}>
                <Grid container spacing={3} alignItems="flex-end">
                    {tiers.map((tier) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid item key={tier.title} xs={12} sm={6} md={3} >
                            <Card>
                                <CardHeader title={tier.title} subheader={tier.subheader}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{ align: 'center', }}
                                    sx={{ backgroundColor: '#cfd8dc', }}
                                />
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, }} >
                                        <Typography component="h2" variant="h3" color="text.bold">{tier.icon}</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" align="center" > {tier.description} </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* Footer */}
            {/* <Grid container spacing={4} justifyContent="space-evenly">
                    {footers.map((footer) => (
                        <Grid item xs={6} sm={3} key={footer.title}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                {footer.title}
                            </Typography>
                            <ul>
                                {footer.description.map((item) => (
                                    <li key={item}>
                                        <Link href="#" variant="subtitle1" color="text.secondary">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    ))}
                </Grid> */}
            {/* <Copyright sx={{ mt: 5 }} /> */}
            {/* End footer */}
        </>
    );
}

export default Objectives;
