import axios from "axios";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { base_url } from "../App";
import useToken from "../auth/Token";
import AlertMessage from "./components/AlertMessage";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled } from "@mui/material/styles";
import DownloadFileTile from "./components/DownloadFileTile";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState();
  const [alertContent, setAlertContent] = useState();
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [checked, setChecked] = useState([]);

  const { token } = useToken();

  useEffect(() => {
    if (token?.user) {
      getUserScheduleDownloads(token.user)
        .then((response) => {
          setSchedules(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleSelect = (e, schedule_id) => {
    let tmp;
    if (e.target.checked) {
      tmp = [...checked, schedule_id];
    } else {
      tmp = checked.filter((item) => item !== schedule_id);
      setAllSelected(false);
    }
    setChecked(tmp);

    if (tmp.length === schedules?.length) {
      setAllSelected(true);
    }
  };

  const handleSelectAll = (e) => {
    setAllSelected(e.target.checked);
    if (e.target.checked) {
      setChecked(schedules?.map((schedule) => schedule.schedule_id));
    } else {
      setChecked([]);
    }
  };

  const clearEntry = (e) => {
    console.log(checked);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      //   backgroundColor: theme.palette.common.black,
      //   color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <div>
      <Container maxWidth="md" component="main" sx={{ pt: 6, pb: 6 }}>
        {showAlert ? (
          <AlertMessage
            message={alertContent}
            show={setShowAlert}
            variant={alertType}
          />
        ) : (
          <></>
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell width={80}>
                  <Checkbox
                    color="primary"
                    value="all"
                    checked={allSelected}
                    indeterminate={checked.length > 0 && !allSelected}
                    onChange={handleSelectAll}
                  />
                  {checked.length > 0 && (
                    <IconButton
                      color="info"
                      aria-label="expand row"
                      size="small"
                      onClick={clearEntry}
                    >
                      <DeleteForeverIcon color="primary" />
                    </IconButton>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Filepath</StyledTableCell>
                <StyledTableCell align="right">Date & Time</StyledTableCell>
                <StyledTableCell align="right">Scheduled</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules?.map((schedule, key) => {
                let data = {
                  id: schedule.schedule_id,
                  file_path: schedule.full_path,
                  start_time: schedule.start_time,
                  checked: checked.includes(schedule.schedule_id) || allSelected,
                  handleChange: (e) => handleSelect(e, schedule.schedule_id),
                };
                return (
                  <DownloadFileTile key={key} data={data} submit={clearEntry} />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

async function getUserScheduleDownloads(username) {
  let url = `${base_url}/schedules?username=${username}`;
  return axios
    .get(url)
    .then((response) => {
      if (response.data?.status === 200) {
        return response.data?.data;
      } else {
        console.error(new Error(response.data?.message));
        return new Error(response.data?.message);
      }
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
}
