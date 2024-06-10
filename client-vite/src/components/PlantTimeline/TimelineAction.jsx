import PropTypes from "prop-types";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";

const actionData={
  Start:{color:'success',text:'Start'},
  Picking:{color:'secondary',text:'Picking'},
  Relocation:{color:'info',text:'Relocation'},
  SetGender:{color:'success',text:'Set Gender'},
  MakeMother:{color:'primary',text:'Make Mother'},
  Note:{color:'info',text:'Note'},
  CuttingClones:{color:'warning',text:'Cutting Clones'},
  Blooming:{color:'success',text:'Blooming Start'},
  Stop:{color:'error',text:'Stop'},
  Harvest:{color:'success',text:'Harvest'},
}

export default function TimelineAction({ action }) {
  return (
    <TimelineItem>
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
        <TimelineDot color={actionData[action.type]?.color}></TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent >
        <Typography variant="h5">{actionData[action.type]?.text}</Typography>
        {action?.oldAddress && (
          <Typography variant="caption">
            Building:{action.oldAddress?.building}
            Room:{action.oldAddress?.room}
            Row:{action.oldAddress?.row}
            Tray{action.oldAddress?.tray}
          </Typography>
        )}
        {action?.potSize && (
          <Typography variant="caption">{action.potSize}</Typography>
        )}
        {action?.reason && 
          <Typography variant="caption">{action.reason}</Typography>
        }
        {action?.userReason && 
          <Typography variant="caption">{action.userReason}</Typography>
        }
        {action.note?.type && 
          <Typography variant="caption">{action.note.type} </Typography>
        }
        {action.note?.variant && 
          <Typography variant="caption">{action.note.variant} </Typography>
        }
        {action.note?.item && 
          <Typography variant="caption" component="span">{action.note.item} </Typography>
        }
         {action?.clonesNumber && 
          <Typography variant="caption">Cut {action.clonesNumber} clones</Typography>
        }
      </TimelineContent>
    </TimelineItem>
  );
}


TimelineAction.propTypes = {
  action: PropTypes.object,
};
