import { Card  } from "@mui/material";
import ChannelsList from "./ChannelsList";
import TimerList from "./TimerList";




const LightController=()=>{
  return(
    <Card sx={{
      background:"rgba(104,104,125,0.9)",
      p:"5px"
    }}> 
      <ChannelsList addButton defaultCollapsed/>
      <TimerList/>
    </Card>
  )
}

export default LightController;