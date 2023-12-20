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
  MakeMother:{color:'primary',text:'Make Mother'},
  Note:{color:'info',text:'Note'},
  CuttingClones:{color:'warning',text:'Cutting Clones'},
  Blooming:{color:'success',text:'Bluming Start'},
  Stop:{color:'error',text:'Stop'},
  Harvest:{color:'success',text:'Harvest'},
}

export default function TimelineAction({ action }) {
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: "auto 0" }}
        align="center"
        variant="body2"
        color="text.secondary"
      >
        {new Date(action.date).toDateString()}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color={actionData[action.type]?.color}></TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: "12px", px: 2 }}>
        <Typography variant="h6">{actionData[action.type]?.text}</Typography>
        {action?.oldAddress && (
          <Typography variant="caption">
            {action.oldAddress.building}

            {action.oldAddress.room}
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
          <Typography variant="caption">{action.note.type}</Typography>
        }
         {action?.clonesNumber && 
          <Typography variant="caption">Cut {action.clonesNumber} clones</Typography>
        }
      </TimelineContent>
    </TimelineItem>
  );
}
