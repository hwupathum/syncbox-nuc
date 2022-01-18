import { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArticleIcon from '@mui/icons-material/Article';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function DirectoryTile(props) {
    let { data } = props;
    const [open, setOpen] = useState(false);

    return (<>
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
            <TableCell align="right">{getFileTypeIcon(data.type)}</TableCell>
            <TableCell component="th" scope="row">
                <Link href={`/data/${data.location}/${data.name}`} underline="none">{data.name}</Link>
            </TableCell>
            <TableCell align="right">{data.size}</TableCell>
            <TableCell align="right">{new Date().toLocaleTimeString()}</TableCell>
            <TableCell align="right">{new Date().toLocaleTimeString()}</TableCell>
            <TableCell align="center">
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} >
                    {open ? <CancelIcon /> : <DownloadIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            History
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Total price ($)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                Hi
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>);
}

const getFileTypeIcon = (type) => {
    if (type === '') {
        return <FileCopyIcon />
    } else if (['.jpg', '.png', '.jpeg'].indexOf(type) > -1) {
        return <ImageIcon />
    } else if (['.mp3'].indexOf(type) > -1) {
        return <MusicNoteIcon />
    } else if (['.mp4', '.mkv'].indexOf(type) > -1) {
        return <OndemandVideoIcon />
    } else if (['.srt', '.txt'].indexOf(type) > -1) {
        return <ArticleIcon />
    } else {
        return <HelpOutlineIcon />
    }
}
