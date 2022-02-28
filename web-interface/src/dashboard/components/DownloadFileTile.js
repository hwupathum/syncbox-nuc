import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";

export default function DownloadFileTile(props) {
  let { data, submit, folder = false } = props;
  let date_time = new Date(data.start_time);

  return (
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
          {data.file_path}
        </TableCell>
        <TableCell align="right">{date_time.toLocaleDateString() + "\n" + date_time.toLocaleTimeString()}</TableCell>
        <TableCell align="right">System</TableCell>
        <TableCell align="center">
          {!data.checked && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={submit}
            >
              <DeleteForeverIcon color="primary" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
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
