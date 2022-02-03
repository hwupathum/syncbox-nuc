import { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
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
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TimePicker from '@mui/lab/TimePicker';

export default function DirectoryTile(props) {
    let { data, submit } = props;
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date('2014-08-18T00:00:00'));
    const [time, setTime] = useState(new Date('2014-08-18T00:00:00'));

    const handleSubmit = e => {
        e.preventDefault();
        submit(data.name, date.toISOString().split('T')[0], time.toTimeString().split(' ')[0]);
    }

    return (<>
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
            <TableCell align="right">{getFileTypeIcon(data.type)}</TableCell>
            <TableCell component="th" scope="row">
                <Link href={data.link ? `/data/${data.location}/${data.name}` : '#'} underline="none">{data.name}</Link>
            </TableCell>
            <TableCell align="right">{data.size}</TableCell>
            <TableCell align="right">{data.last_updated}</TableCell>
            <TableCell align="right">{data.last_synced}</TableCell>
            <TableCell align="center">
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} >
                    {open ? <CancelIcon /> : <DownloadIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 6, paddingTop: 4 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ margin: 1 }}>
                        <Stack direction="row" spacing={8} justifyContent="center" alignItems="center" >
                            {/* <Typography variant="p" component="div">Select Date and Time</Typography> */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="Select Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={date}
                                    onChange={(value) => setDate(value)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <TimePicker
                                    label="Select Time (Optional)"
                                    value={time}
                                    onChange={(value) => setTime(value)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Button type="submit" size="small" variant="contained" endIcon={<DownloadIcon />}>Schedule</Button>
                        </Stack>
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
