import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { Button } from '@mui/material';



export const TrayItem=()=>{


  return(

    <>
    <Button variant="outlined" sx={{m:'1px',maxWidth:"80px"}}color="success" startIcon={<LocalFloristIcon />}>
    </Button>
    
    </>

  )
}