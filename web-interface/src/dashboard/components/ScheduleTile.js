import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TimePicker from '@mui/lab/TimePicker';
import DownloadIcon from '@mui/icons-material/Download';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function ScheduleTile(props) {
    const { filename, open, selected, submit } = props;
    const [date, setDate] = useState(new Date('2014-08-18T00:00:00'));
    const [time, setTime] = useState(new Date('2014-08-18T00:00:00'));

    const handleSubmit = e => {
        e.preventDefault();
        submit(filename, date.toISOString().split('T')[0], time.toTimeString().split(' ')[0]);
    }

    return (<>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                {selected && selected.length > 0 && <>
                    <Typography variant="button" display="block" gutterBottom>Selected Items: </Typography>
                    <Typography variant="caption" display="block" gutterBottom>{selected.join(', ')}</Typography>
                </>}
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box style={{ paddingBottom: 6, paddingTop: 4 }} component="form" noValidate onSubmit={handleSubmit} sx={{ margin: 1 }}>
                        <Stack direction="row" spacing={8} justifyContent="center" alignItems="center" >
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
    </>)
}
