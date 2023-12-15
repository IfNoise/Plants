import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";

const actionColor={
  Start:'success',
  Picking:'secondary',
  Relocation:'info',
  MakeMother:'primary',
  Note:'info',
  CuttingClones:'warning',
  Blooming:'success',
  Stop:'error',
  Harvest:'success'
}

export default function TimelineAction({ action }) {
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: "auto 0" }}
        align="right"
        variant="body2"
        color="text.secondary"
      >
        {new Date(action.date).toDateString()}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color={actionColor[action.type]}></TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: "12px", px: 2 }}>
        <Typography variant="h6">{action.type}</Typography>
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
         {action?.clonesNumber && 
          <Typography variant="caption">Cut {action.clonesNumber} clones</Typography>
        }
      </TimelineContent>
    </TimelineItem>
  );
}
