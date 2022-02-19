import axios from "axios";
import { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { base_url } from "../App";
import useToken from "../auth/Token";
import AlertMessage from "./components/AlertMessage";
import DirectoryTile from "./components/DirectoryTile";
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import ScheduleTile from "./components/ScheduleTile";
import { styled } from '@mui/material/styles';

export default function DashboardPage() {
    const [fileData, setFileData] = useState({});
    const [alertContent, setAlertContent] = useState();
    const [alertType, setAlertType] = useState("success");
    const [showAlert, setShowAlert] = useState(false);
    const [open, setOpen] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [checked, setChecked] = useState([]);

    const { token } = useToken();
    let location = decodeURI(window.location.pathname.substr(6));

    useEffect(() => {
        if (token?.user) {
            getUserDirectories(token.user, location)
                .then(response => {
                    setFileData(response.data);
                }).catch(error => {
                    console.error(error);
                });
        }
    }, []);

    const handleScheduleDownload = async (filename, startDate, startTime) => {
        if (token?.user && filename && startDate && startTime) {
            return axios.post(`${base_url}/schedule?username=${token.user}&filenames=${location}/${filename}&day=${startDate}&time=${startTime}`)
                .then(response => {
                    if (response.data?.status === 200) {
                        setAlertContent(`${filename} is scheduled to download successfully`);
                        setAlertType("success");
                        setShowAlert(true);
                        return response.data?.data;
                    } else {
                        console.error(new Error(response.data?.message));
                        setAlertContent(response.data?.message);
                        setAlertType("danger");
                        setShowAlert(true);
                    }
                })
                .catch(error => {
                    console.error(error);
                    setAlertContent(`An error occurred`);
                    setAlertType("danger");
                    setShowAlert(true);
                    return error;
                });
        } else {
            let warn = `${token?.user ? "" : "user "}${filename ? "" : "& filename "}${startDate ? "" : "& start date "}${startTime ? "" : "& start time "}`;
            setAlertContent(`${warn[0] === '&' ? warn.substring(2) : warn} not provided`);
            setAlertType("warning");
            setShowAlert(true);
        }
    }

    const handleSelect = (e, filename) => {
        let tmp;
        if (e.target.checked) {
            tmp = [...checked, filename];
        } else {
            tmp = checked.filter(item => item !== filename);
            setAllSelected(false);
        }
        setChecked(tmp);

        if (tmp.length === fileData?.directories?.length + fileData?.files?.length) {
            setAllSelected(true);
        } else if (tmp.length === 0) {
            setOpen(false);
        }
    };

    const handleSelectAll = (e) => {
        setAllSelected(e.target.checked);
        if (e.target.checked) {
            setChecked(fileData?.directories?.map(directory => directory.name).concat(fileData?.files?.map(file => file.name)));
        } else {
            setChecked([]);
            setOpen(false);
        }
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));

    return (
        <div>
            <Container maxWidth="md" component="main" sx={{ pt: 6, pb: 6 }}>
                {showAlert ? (<AlertMessage message={alertContent} show={setShowAlert} variant={alertType} />) : (<></>)}
                {fileData?.directories?.length > 0 || fileData?.files?.length > 0 ? <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    <Checkbox value="all" checked={allSelected} indeterminate={checked.length > 0 && !allSelected} onChange={handleSelectAll} />
                                    {checked.length > 0 && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} >
                                        <DownloadIcon />
                                    </IconButton>}
                                </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align="right">Size</StyledTableCell>
                                <StyledTableCell align="right">Last Updated</StyledTableCell>
                                <StyledTableCell align="right">Status</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <ScheduleTile open={open} submit={handleScheduleDownload} filename={checked.join(', ')} selected={checked} ></ScheduleTile>
                        <TableBody>
                            {fileData.directories?.map((directory, key) => {
                                let data = {
                                    link: true,
                                    location,
                                    name: directory.name,
                                    size: directory.size,
                                    type: directory.extension,
                                    checked: checked.includes(directory.name) || allSelected,
                                    handleChange: (e) => handleSelect(e, directory.name)
                                };
                                return <DirectoryTile folder={true} key={key} data={data} submit={handleScheduleDownload} />
                            })}
                            {fileData.files?.map((file, key) => {
                                let data = {
                                    link: false,
                                    location,
                                    name: file.name,
                                    size: file.size,
                                    type: file.extension,
                                    checked: checked.includes(file.name) || allSelected,
                                    last_updated: file.access_time,
                                    last_synced: file.synced_time,
                                    handleChange: (e) => handleSelect(e, file.name)
                                };
                                return <DirectoryTile key={key} data={data} submit={handleScheduleDownload} />
                            })}
                        </TableBody>
                    </Table>
                </TableContainer> : <p>No data found!</p>}
            </Container>
        </div>
    );
}

async function getUserDirectories(username, location) {
    let url = `${base_url}/files?username=${username}&location=${location ?? '/'}`;
    return axios.get(url)
        .then(response => {
            if (response.data?.status === 200) {
                return response.data?.data;
            } else {
                console.error(new Error(response.data?.message));
                return new Error(response.data?.message);
            }
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}
