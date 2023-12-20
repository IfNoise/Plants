import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { Button, Typography } from '@mui/material';



export const TrayItem=({plant})=>{


  return(

    <>
    <Button variant="outlined" sx={{m:'1px',maxWidth:"80px"}}color="success" startIcon={<LocalFloristIcon />}>
      <Typography variant='button_text'>plant?.pheno</Typography>
    </Button>
    
    </>

  )
}