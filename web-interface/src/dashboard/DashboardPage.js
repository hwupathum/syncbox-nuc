import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { base_url } from "../App";
import useToken from "../auth/Token";
import AlertMessage from "./components/AlertMessage";
import DirectoryTile from "./components/DirectoryTile";
import FileTile from "./components/FileTile";

export default function DashboardPage() {
    const [fileData, setFileData] = useState({});
    const [alertContent, setAlertContent] = useState();
    const [alertType, setAlertType] = useState("success");
    const [showAlert, setShowAlert] = useState(false);

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

    const handleScheduleDownload = async (e, filename, startDate, startTime) => {
        e.preventDefault();
        console.log(filename, startDate, startTime);

        if (token?.user && filename && startDate && startTime) {
            return axios.get(`${base_url}/schedule?username=${token.user}&filename=${location}/${filename}&day=${startDate}&time=${startTime}`)
                .then(response => {
                    setAlertContent(`${filename} is scheduled to download successfully`);
                    setAlertType("success");
                    setShowAlert(true);
                    return response.data;
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

    const handleQuickDownload = async (filename) => {
        if (token?.user && filename) {
            return axios.get(`${base_url}/download?username=${token.user}&filename=${location}/${filename}`)
                .then(response => {
                    setAlertContent(`${filename} is downloaded successfully`);
                    setAlertType("success");
                    setShowAlert(true);
                    return response.data;
                })
                .catch(error => {
                    console.error(error);
                    setAlertContent(`An error occurred`);
                    setAlertType("danger");
                    setShowAlert(true);
                    return error;
                });
        } else {
            let warn = `${token?.user ? "" : "user "}${filename ? "" : "& filename "}`;
            setAlertContent(`${warn[0] === '&' ? warn.substring(2) : warn} not provided`);
            setAlertType("warning");
            setShowAlert(true);
        }
    }

    // function CustomToggle({ children, eventKey, callback }) {
    //     const { activeEventKey } = useContext(AccordionContext);

    //     const decoratedOnClick = useAccordionButton(eventKey, () => {
    //         callback && callback(eventKey);
    //     });

    //     const isCurrentEventKey = activeEventKey === eventKey;

    //     return <button
    //         className={isCurrentEventKey ? "btn btn-sm btn-primary" : 'btn btn-sm btn-secondary'}
    //         onClick={decoratedOnClick}
    //     >
    //         {children}
    //     </button>
    // }

    return (
        <div>
            <Container maxWidth="md" component="main" sx={{ pt: 6, pb: 6 }}>
                {showAlert ? (<AlertMessage message={alertContent} show={setShowAlert} variant={alertType} />) : (<></>)}
                {fileData?.directories?.length > 0 || fileData?.files?.length > 0 ? <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Size</TableCell>
                                <TableCell align="right">Last Updated</TableCell>
                                <TableCell align="right">Synced</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fileData.directories?.map((directory, key) => {
                                let data = { location, name: directory.name, size: directory.size, type: directory.extension };
                                return <DirectoryTile key={key} data={data} />
                            })}
                            {fileData.files?.map((file, key) => {
                                let data = { location, name: file.name, size: file.size, type: file.extension };
                                return <DirectoryTile key={key} data={data} />
                            })}
                        </TableBody>
                    </Table>
                </TableContainer> : <p>No data found!</p>}
            </Container>
            {/* <Container className="mt-3">
                {showAlert ? (<AlertMessage message={alertContent} show={setShowAlert} variant={alertType} />) : (<></>)}
                {fileData?.directories?.length > 0 || fileData?.files?.length > 0 ? (<>
                    <ListGroup>
                        {fileData.directories?.map((directory, key) => {
                            return <DirectoryTile key={key} id={key} location={location} name={directory.name} />
                        })}
                    </ListGroup>
                    <Accordion defaultActiveKey="0">
                        <ListGroup>
                            {fileData.files?.map((file, key) => {
                                return <ListGroup.Item key={key}>
                                    <Card>
                                        <Card.Body>
                                            <Row>
                                                <Col xs={12} md={8}>{file.name} ({file.size})</Col>
                                                <Col xs={6} md={4}>
                                                    <CustomToggle eventKey={key}>Download Options</CustomToggle>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                        <Accordion.Collapse eventKey={key}>
                                            <FileTile file={file} download={handleQuickDownload} schedule={handleScheduleDownload} />
                                        </Accordion.Collapse>
                                    </Card>
                                </ListGroup.Item>
                            })}
                        </ListGroup>
                    </Accordion>
                </>
                ) : (
                    <p>No data found!</p>
                )}
            </Container> */}
        </div>
    );
}

async function getUserDirectories(username, location) {
    let url = `${base_url}/data?username=${username}`;
    if (location) {
        url += `&location=${location}`;
    }
    return axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}
