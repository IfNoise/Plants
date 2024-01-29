import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Fab, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useCallback } from "react";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PrintIcon from "@mui/icons-material/Print";
import { useGetPlantsQuery } from "../store/plantsApi";
import { useAddToTrayMutation } from "../store/trayApi";
import { NewActionButton } from "../components/NewActionButton/NewActionButton";
import { usePrintPlantsMutation } from "../store/printApi";
import { useEffect, useState } from "react";
import { FilterBar } from "../components/FilterBar/FilterBar";
import PlantCard from "../components/PlantCard/PlantCard";
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
  { field: "strain",
   headerName: "Strain",
    width: 250 
  },
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
    color: "green",
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
  const theme=useTheme();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isLarge = useMediaQuery((theme) => theme.breakpoints.up("md"))
  const [filter, setFilter] = useState({})
  const { isLoading, isError, error, data } = useGetPlantsQuery(filter,    {refetchOnMountOrArgChange: true,
    refetchOnFocus: true},);
  const apiRef = useGridApiRef(null);
  const [apiIsLoaded, setApiIsLoaded] = useState(false);
  const [sel, setSel] = useState(false);
  const [addToTray] = useAddToTrayMutation();
  const [printPlants] = usePrintPlantsMutation();
  const plantDetails = (id) => {
    navigate(`/plant/${id}`);
  };
  

  const getSelected = useCallback(() => {
    if (Object.keys(apiRef.current).length === 0) {
      return [];
    }
    return Array.from(apiRef.current.getSelectedRows().keys());
  }, [apiRef]);

  const getSelectedPlants = useCallback(() => {
    if (Object.keys(apiRef.current).length === 0) {
      return [];
    }
    return Array.from(apiRef.current.getSelectedRows().values());
  },[apiRef]);

  const checkboxSelectionHandler = () => {
    setSel(getSelected().length < 1);
  };

  useEffect(() => {
    console.log(apiRef);
  if(Object.keys(apiRef.current).length === 0){
      return
    }
    setApiIsLoaded(true);
    
    apiRef.current.subscribeEvent(
      "rowSelectionCheckboxChange",
      checkboxSelectionHandler
    );
  
  }, [apiRef]);

  return (
    <>
      <FilterBar setOutputFilter={setFilter} />
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.length>0 && isLarge && 
      
        <DataGrid
        autoPageSize
          display={ isSmall ? "none" : "block"}
          getRowId={getRowId}
          autoHeight={false}
          checkboxSelection
          rows={data?.map((plant) => {
            return {
              ...plant,
              start: new Date(plant.actions[0]?.date || "0").toDateString(),
            };
          })}
          sx={{ width: "100%" ,height: '90%'}}
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
      }
     
       {apiIsLoaded && isLarge && <>
        <Fab
        disabled={getSelected().length === 0}
        sx={printFabStyle}
        onClick={() => {
          const plants = getSelected();
          printPlants( {plants} );
        }}
        >
        <PrintIcon />
       </Fab>
       <Fab
        disabled={getSelected().length === 0}
        sx={fabStyle}
        onClick={() => {
          const plants = getSelected();
          addToTray(plants);
        }}
       > 
        <CreateNewFolderIcon />
       </Fab>
       <NewActionButton 
       disabled={getSelected().length === 0}
       getPlants={getSelectedPlants} />
       </>
       }
      {data?.length>0 && isSmall &&
      <>
      <Grid container spacing={1}>
      {data?.map((obj)=>{
        return (<Grid item xs={12} sm={6} md={4} lg={3} key ={obj._id}><PlantCard plant={obj}/></Grid>)
      })}
      </Grid>
      </>
      }
    </>
  )
};
