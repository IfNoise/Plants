import { Badge, IconButton} from "@mui/material";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import {useGetTrayQuery } from "../../store/trayApi";
import { useNavigate } from "react-router-dom";


export const TrayButton = () => {
  const navigate = useNavigate();
  const { data } = useGetTrayQuery({},{ refetchOnMountOrArgChange: true, refetchOnFocus: true } );
  const trayPage = () => {
    navigate(`/tray`);
  };
  
  return (
    <>
      <IconButton
        size="large"
        id="tray_button"
        aria-label="show 4 new mails"
        color="inherit"
        onClick={trayPage}
      >
        {data&&
          <Badge badgeContent={data.length} color="error">
          <FolderSpecialIcon />
        </Badge>}
      </IconButton>
    </>
  );
};
