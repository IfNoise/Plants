import PropTypes from "prop-types";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import { Box, ImageList, ImageListItem, Link, Paper, Popper } from "@mui/material";
import propsTypes from "prop-types";

import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CancelIcon from '@mui/icons-material/Cancel';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import EventNoteIcon from '@mui/icons-material/EventNote';
import WcIcon from '@mui/icons-material/Wc';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import EastIcon from '@mui/icons-material/East';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useState } from "react";

const actionData={
  Start:{color:'success',text:'Start',icon:<SaveAltIcon/>},
  Picking:{color:'secondary',text:'Picking',icon:<MoveUpIcon/>},
  Relocation:{color:'info',text:'Relocation',icon:<EastIcon/>},
  SetGender:{color:'success',text:'Set Gender',icon:<WcIcon/>},
  MakeMother:{color:'primary',text:'Make Mother',icon: <PregnantWomanIcon/>}, 
  Note:{color:'info',text:'Note',icon:<EventNoteIcon/>},
  CuttingClones:{color:'warning',text:'Cutting Clones',icon:<ContentCutIcon/>},
  Blooming:{color:'warning',text:'Blooming Start',icon:<LocalFloristIcon/>},
  Stop:{color:'error',text:'Stop',icon:<CancelIcon/>},
  Harvest:{color:'success',text:'Harvest',icon:<AgricultureIcon/>},
  addPhoto:{color:'info',text:'Add Photo',icon:<AddAPhotoIcon/>},
  Insecticide:{color:'error',text:'Insecticide',icon:<BugReportIcon/>},
  Cutting:{color:'warning',text:'Cutting',icon:<ContentCutIcon/>}
}
const PlantGroup=({group})=>{
  const params=new URLSearchParams({group});
  return <div 
    style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:"green",
      color:"white",
      borderRadius:"5px",
      padding:"5px",
      margin:"5px"
    }}
  >
  {group&&
  <Link href={`/plants?${params}`} >Group</Link>}
  {!group&&
  <Typography variant="caption" color="text.secondary">No Group</Typography>}
  </div>
  }
  PlantGroup.propTypes={
    group:propsTypes.string.isRequired
  }

export default function TimelineAction({ action }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const handleEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const isManyInfo = action?.photo?.length>0 || action?.oldAddress || action?.newAddress || action?.clonesNumber || action?.group;
  const handleLeave = () => {
    setAnchorEl(null);
    setOpen(false);
  }
  return (
    <>
    <TimelineItem
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    
    >
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
        <TimelineDot color={actionData[action.type]?.color}>{actionData[action.type]?.icon}</TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent >
        <Typography variant="h5">{actionData[action.type]?.text}</Typography>
        
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
    {isManyInfo&&<Popper
        open={open}
        anchorEl={anchorEl}
        anc
        onClose={() => {}}
      ><Paper
      sx={{
        width: "150px",
        height: "150px",
        p: "15px",
        m: "3px",
      }}
      >
        {action?.oldAddress && (
          <Box maxWidth="100px" sx={{
            width: "100%",
            maxWidth: "100px",
          }}>
          <Typography variant="body2" gutterBottom >
            Building:{action.oldAddress?.building}
            Room:{action.oldAddress?.room}
            Row:{action.oldAddress?.row||''}
            Tray{action.oldAddress?.tray||''}
          </Typography>
          </Box>
        )}
        {action?.newAddress && (
          <Box maxWidth="100px" sx={{
            width: "100%",
            maxWidth: "100px",
          }}>
          <Typography variant="body2" gutterBottom >
            Building:{action.newAddress?.building}
            Room:{action.newAddress?.room}
            Row:{action.newAddress?.row||''}
            Tray{action.newAddress?.tray||''}
          </Typography>
          </Box>
        )}
        {action?.photo?.length>0 && 
        <ImageList sx={{ width: 150, height: 150 }} cols={1}>
          {action.photo.map((item,i) => (
            <ImageListItem key={i}>
              <img src={`/upload/${item}`} alt={`Photo ${i}`} />
            </ImageListItem>
          ))}
        </ImageList>
          }
          {action?.clonesNumber &&
          
          <Typography variant="body2" gutterBottom >Cutted {action.clonesNumber} clones</Typography>
          }
          {action?.group && <PlantGroup group={action.group} />}
        </Paper>
      </Popper>}

    </>
  );
}


TimelineAction.propTypes = {
  action: PropTypes.object,
};
