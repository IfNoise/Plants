import PropTypes from "prop-types";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import {
  Box,
  ImageList,
  ImageListItem,
  Link,
  Paper,
  Popover,
} from "@mui/material";
import propsTypes from "prop-types";

import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CancelIcon from "@mui/icons-material/Cancel";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WcIcon from "@mui/icons-material/Wc";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import EastIcon from "@mui/icons-material/East";
import BugReportIcon from "@mui/icons-material/BugReport";
import { useState } from "react";

const actionData = {
  Start: { color: "success", text: "Start", icon: <SaveAltIcon /> },
  Picking: { color: "secondary", text: "Picking", icon: <MoveUpIcon /> },
  Relocation: { color: "info", text: "Relocation", icon: <EastIcon /> },
  SetGender: { color: "success", text: "Set Gender", icon: <WcIcon /> },
  MakeMother: {
    color: "primary",
    text: "Make Mother",
    icon: <PregnantWomanIcon />,
  },
  Note: { color: "info", text: "Note", icon: <EventNoteIcon /> },
  CuttingClones: {
    color: "warning",
    text: "Cutting Clones",
    icon: <ContentCutIcon />,
  },
  Blooming: {
    color: "warning",
    text: "Blooming Start",
    icon: <LocalFloristIcon />,
  },
  Stop: { color: "error", text: "Stop", icon: <CancelIcon /> },
  Harvest: { color: "success", text: "Harvest", icon: <AgricultureIcon /> },
  AddPhoto: { color: "info", text: "Add Photo", icon: <AddAPhotoIcon /> },
  Insecticide: { color: "error", text: "Insecticide", icon: <BugReportIcon /> },
  Cutting: { color: "warning", text: "Cutting", icon: <ContentCutIcon /> },
};
const PlantGroup = ({ group }) => {
  const params = new URLSearchParams({ group });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        color: "white",
        borderRadius: "5px",
        padding: "5px",
        margin: "5px",
      }}
    >
      {group && <Link href={`/plants?${params}`}>Group</Link>}
      {!group && (
        <Typography variant="caption" color="text.secondary">
          No Group
        </Typography>
      )}
    </div>
  );
};
PlantGroup.propTypes = {
  group: propsTypes.string.isRequired,
};

export default function TimelineAction({ action }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const isManyInfo =
    action?.photos?.length > 0 ||
    action?.oldAddress ||
    action?.newAddress ||
    action?.clonesNumber ||
    action?.group;
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(!open);
  };
  return (
    <>
      <TimelineItem onClick={handleClick}>
        <TimelineOppositeContent
          sx={{ m: "auto 0" }}
          align="center"
          variant="caption"
          color="text.secondary"
        >
          {new Date(action.date).toDateString()}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector />
          <TimelineDot color={actionData[action.type]?.color}>
            {actionData[action.type]?.icon}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h5">{actionData[action.type]?.text}</Typography>

          {action?.potSize && (
            <Typography variant="caption">{action.potSize}</Typography>
          )}
          {action?.reason && (
            <Typography variant="caption">{action.reason}</Typography>
          )}
          {action?.userReason && (
            <Typography variant="caption">{action.userReason}</Typography>
          )}
          {action.note?.type && (
            <Typography variant="caption">{action.note.type} </Typography>
          )}
          {action.note?.variant && (
            <Typography variant="caption">{action.note.variant} </Typography>
          )}
          {action.note?.item && (
            <Typography variant="caption" component="span">
              {action.note.item}{" "}
            </Typography>
          )}
          {action?.clonesNumber && (
            <Typography variant="caption">
              Cut {action.clonesNumber} clones
            </Typography>
          )}
        </TimelineContent>
      </TimelineItem>
      {isManyInfo && (
        <Popover open={open} anchorEl={anchorEl} onClose={handleClose}>
          <Paper
            sx={{
              padding: "5px",
              minWidth: "160px",
              minHeight: "160px",
              maxWidth: "320px",
              maxHeight: "3200px",
            }}
          >
            {action?.oldAddress && (
              <Box
                maxWidth="100px"
                sx={{
                  width: "100%",
                  maxWidth: "100px",
                }}
              >
                <Typography
                  sx={{
                    overflow: "hidden",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {`Old Address:
            Building: ${action.oldAddress?.building}
            Room: ${action.oldAddress?.room}
            Row: ${action.oldAddress?.row || ""}
            Rack: ${action.oldAddress?.rack || ""}
            Shelf: ${action.oldAddress?.shelf || ""}
            Tray: ${action.oldAddress?.tray || ""}`}
                </Typography>
              </Box>
            )}
            {action?.newAddress && (
              <Box
                sx={{
                  maxWidth: "100px",
                }}
              >
                <Typography
                  sx={{
                    overflow: "hidden",
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                  variant="body2"
                  gutterBottom
                >
                  {`New Address:
            Building: ${action.newAddress?.building}
            Room: ${action.newAddress?.room}
            Row: ${action.newAddress?.row || ""}
            Rack: ${action.newAddress?.rack || ""}
            Shelf: ${action.newAddress?.shelf || ""}
            Tray: ${action.newAddress?.tray || ""}`}
                </Typography>
              </Box>
            )}
            {action?.photos?.length > 0 && (
              <ImageList
                sx={{ p: "5px" }}
                cols={3}
                rowHeight={200}
                variant="quilted"
              >
                {action.photos.map((item, i) => (
                  <ImageListItem
                    component={"a"}
                    href={`https://ddweed.org/gallery/${item}`}
                    sx={{ borderRadius: "2px" }}
                    key={i}
                  >
                    <img
                      src={`https://ddweed.org/gallery/${item}`}
                      alt={`Photo ${i}`}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
            {action?.clonesNumber && (
              <Typography variant="body2" gutterBottom>
                Cutted {action.clonesNumber} clones
              </Typography>
            )}
            {action?.group && <PlantGroup group={action.group} />}
          </Paper>
        </Popover>
      )}
    </>
  );
}

TimelineAction.propTypes = {
  action: PropTypes.object,
};
