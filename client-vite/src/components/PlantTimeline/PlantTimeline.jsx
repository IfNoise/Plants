import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import TimelineAction from './TimelineAction';
import PropTypes from "prop-types";

export default function PlantTimeline({actions}) {
  return (
    <Timeline position="alternate">
    
      {actions&&actions.map((action,i)=>(<TimelineAction key={i} action={action}/>))}
    </Timeline>
  );
}
PlantTimeline.propTypes = {
  actions: PropTypes.array,
};