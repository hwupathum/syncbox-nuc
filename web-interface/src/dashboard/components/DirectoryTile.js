import { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import Checkbox from "@mui/material/Checkbox";
import ScheduleTile from "./ScheduleTile";
import FolderIcon from "@mui/icons-material/Folder";

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

export default function DirectoryTile(props) {
  let { data, submit, folder = false } = props;
  let synced_time;
  const [open, setOpen] = useState(false);

  if (data.last_synced) {
    synced_time = new Date(data.last_synced);
    synced_time.addHours(5.5);
  }

  return (
    <>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell>
          <Checkbox
            color="primary"
            checked={data.checked}
            onChange={data.handleChange}
          />
        </TableCell>
        <TableCell align="right">
          {!folder ? (
            getFileTypeIcon(data.type)
          ) : (
            <FolderIcon color="primary" />
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          <Link
            href={data.link ? `/data/${data.location}/${data.name}` : "#"}
            underline="none"
          >
            {data.name}
          </Link>
        </TableCell>
        <TableCell align="right">{data.size}</TableCell>
        <TableCell align="right">
          {synced_time
            ? synced_time.toLocaleDateString() +
              "\n" +
              synced_time.toLocaleTimeString()
            : "N/A"}
        </TableCell>
        <TableCell align="right">{getSyncStatus(synced_time)}</TableCell>
        <TableCell align="center">
          {!data.checked && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <CancelIcon color="primary" />
              ) : (
                <DownloadIcon color="primary" />
              )}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <ScheduleTile
        open={!data.checked && open}
        submit={submit}
        filename={data.name}
      />
    </>
  );
}

const getFileTypeIcon = (type) => {
  if (type === "") {
    return <InsertDriveFileIcon color="primary" />;
  } else if ([".jpg", ".png", ".jpeg"].indexOf(type) > -1) {
    return <ImageIcon color="primary" />;
  } else if ([".mp3"].indexOf(type) > -1) {
    return <AudioFileIcon color="primary" />;
  } else if ([".mp4", ".mkv"].indexOf(type) > -1) {
    return <VideoFileIcon color="primary" />;
  } else if ([".srt", ".txt"].indexOf(type) > -1) {
    return <DescriptionIcon color="primary" />;
  } else {
    return <InsertDriveFileIcon color="primary" />;
  }
};

const getSyncStatus = (synced_time) => {
  if (!synced_time) {
    return "Not Synced";
  }
  return "Synced";
};
