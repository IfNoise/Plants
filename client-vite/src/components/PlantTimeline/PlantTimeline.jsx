import Timeline from '@mui/lab/Timeline';
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