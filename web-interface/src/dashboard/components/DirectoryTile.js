import { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
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
import Checkbox from '@mui/material/Checkbox';
import ScheduleTile from './ScheduleTile';

export default function DirectoryTile(props) {
    let { data, submit } = props;
    const [open, setOpen] = useState(false);

    return (<>
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
            <TableCell>
                <Checkbox checked={data.checked} onChange={data.handleChange} />
            </TableCell>
            <TableCell align="right">{getFileTypeIcon(data.type)}</TableCell>
            <TableCell component="th" scope="row">
                <Link href={data.link ? `/data/${data.location}/${data.name}` : '#'} underline="none">{data.name}</Link>
            </TableCell>
            <TableCell align="right">{data.size}</TableCell>
            <TableCell align="right">{data.last_updated || 'N/A'}</TableCell>
            <TableCell align="right">{getSyncStatus(data.last_synced, data.last_updated)}</TableCell>
            <TableCell align="center">
                {!data.checked && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} >
                    {open ? <CancelIcon /> : <DownloadIcon />}
                </IconButton>}
            </TableCell>
        </TableRow>
        <ScheduleTile open={!data.checked && open} submit={submit} filename={data.name} />
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

const getSyncStatus = (last_synced, last_updated) => {
    if (!last_synced) {
        return "Not Synced";
    } else if (!last_updated) {
        return "N/A";
    } else if (last_synced > last_updated) {
        return "Synced";
    } else {
        return "New Version Available";
    }
}
