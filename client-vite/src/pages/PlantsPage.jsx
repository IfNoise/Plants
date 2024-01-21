import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Container, Fab} from "@mui/material";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PrintIcon from '@mui/icons-material/Print';
import { useGetPlantsQuery } from "../store/plantsApi";
import { useAddToTrayMutation } from "../store/trayApi";
import { NewActionButton } from "../components/NewActionButton/NewActionButton";
import { usePrintPlantsMutation } from "../store/printApi";
import { useEffect, useState } from "react";
function getRowId(row) {
  return row._id;
}
const fabStyle = {
  position: "fixed",
  bottom: 80,
  right: 16,
};
const printFabStyle = {
  position: "fixed",
  bottom: 160,
  right: 16,
};

const columns = [
  { field: "strain", headerName: "Strain", width: 250 },
  {
    field: "pheno",
    headerName: "Pheno",
    width: 100,
    editable: false,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
    editable: false,
    color:'green'
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 100,
    editable: false,
  },
  {
    field: "state",
    headerName: "State",
    width: 150,
    editable: false,
  },
  {
    field: "start",
    headerName: "Started",
    width: 200,
    editable: false,
  },
  {
    field: "group",
    headerName: "Group",
    width: 150,
    editable: false,
  },

];

export const PlantsPage = () => {
  const navigate = useNavigate();
  const { isLoading, isError, error, data } = useGetPlantsQuery({});
  const apiRef = useGridApiRef(null);
  const [apiIsLoaded,setApiIsLoaded]=useState(false)
  const [sel,setSel]=useState(false)
  const [addToTray] = useAddToTrayMutation();
  const [printPlants]=usePrintPlantsMutation()
  const plantDetails = (id) => {
    navigate(`/plant/${id}`);
  };
  const getSelected=()=>{
    return Array.from(apiRef.current.getSelectedRows().keys())
  }

  const getSelectedPlants=()=>{
    if(!apiRef.current) {
      return []
    }
    return Array.from(apiRef.current.getSelectedRows().values())
  }

  const checkboxSelectionHandler=(params,event,details)=>{
    setSel(getSelected().length<1)
    console.log(params);
  } 

  useEffect(()=>{
    console.log(apiRef);
    setApiIsLoaded(true)
    apiRef.current.subscribeEvent(
      'rowSelectionCheckboxChange',
      checkboxSelectionHandler,
    );
  },[apiRef])
  
  return (
    <>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.length && (
        
        <DataGrid
          getRowId={getRowId}
          checkboxSelection
          rows={data?.map((plant)=>{
            return {
              ...plant,
              start:new Date(plant.actions[0]?.date||'0').toDateString(),
            }
          })}
          sx={{ width: "100%" }}
          apiRef={apiRef}
          columns={columns}
          initialState={{}}
          slots={{
            toolbar: GridToolbar,
          }}
          onCellDoubleClick={(params) => {
            plantDetails(params.row._id);
          }}
        />
      )}

      <Fab
        disabled={sel}
        sx={printFabStyle}
        onClick={() => {
          const plants=getSelected()
          printPlants({plants})
        }}
      >
        <PrintIcon />
      </Fab>
      <Fab
        disabled={sel}
        sx={fabStyle}
        onClick={() => {
          const plants=getSelected()
          addToTray(plants);
        }}
      >
        <CreateNewFolderIcon />
      </Fab>
      {!apiIsLoaded ||< NewActionButton getPlants={getSelectedPlants}/>
      }
    </>
  );
};
