import { Card, Typography } from '@mui/material';




export const TrayItem=({plant})=>{

  return(

    <>
    <Card  display="block" 
      sx={{
        m:"2px",
        p:'1px',
        maxWidth:"60px"
        ,backgroundColor:'lightseagreen'
      }}

     >
      <Typography display="block" sx={{mb:0,p:0,fontSize:9}} variant='overline'>{plant?.pheno}</Typography>
    </Card>

    
    </>

  )
}