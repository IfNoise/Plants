import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { Button, Card, Popover, Typography } from '@mui/material';
import { useState } from 'react';



export const TrayItem=({plant})=>{
  const [openPopup,setOpenPopup]=useState(false)
 const onMouseEnterHandler=()=>{
  setOpenPopup(true)
 }
 const onMouseLeaveHandler=()=>{
  setOpenPopup(false)
 }

  return(

    <>
    <Card  display="block" 
      sx={{
        m:"2px",
        p:'1px',
        maxWidth:"60px"
        ,backgroundColor:'lightseagreen'
      }}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
     >
      <Typography display="block" sx={{mb:0,p:0,fontSize:9}} variant='overline'>{plant?.pheno}</Typography>
    </Card>
    <Popover open={openPopup}>
      <Typography variant='h6'>
        {plant?.strain}
      </Typography>
      <Typography variant='h4'>
        {plant?.pheno}
      </Typography>
      <Typography variant='caption'>
        {plant?.type}
      </Typography>
      <Typography variant='h5'>
        Start:{plant?.start}
      </Typography>
    </Popover>
    
    </>

  )
}