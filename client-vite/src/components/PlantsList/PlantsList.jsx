import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { CircularProgress,Grid, useMediaQuery } from "@mui/material";
import { useCallback } from "react";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import PlantCard from "../../components/PlantCard/PlantCard";
import PlantSpeedDial from "../PlantSpeedDial/PlantSpeedDial";
function getRowId(row) {
  return row._id;
}


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

export const PlantsList = (props) => {
  const plants = props?.plants||[];
  
  const navigate = useNavigate();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isLarge = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const apiRef = useGridApiRef(null);
  const [apiIsLoaded, setApiIsLoaded] = useState(false);
  const [sel, setSel] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState([]);
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
    if(!apiRef.current){
    return []
    }   
    if (Object.keys(apiRef.current).length === 0) {
      return [];
    }
    return Array.from(apiRef.current.getSelectedRows().values());
  }, [apiRef]);

  const checkboxSelectionHandler = () => {
    setSel(getSelected().length < 1);
    setSelectedPlants(getSelectedPlants());
  };

  useEffect(() => {
    console.log(apiRef);
    if (Object.keys(apiRef.current).length === 0) {
      return;
    }
    setApiIsLoaded(true);

    apiRef.current.subscribeEvent(
      "rowSelectionCheckboxChange",
      checkboxSelectionHandler
    );
    apiRef.current.subscribeEvent(
      'headerSelectionCheckboxChange',
      checkboxSelectionHandler,
    );
  }, [apiRef]);

  return (
    <>
      {plants?.length < 1 && <CircularProgress />}
      {plants?.length > 0 && isLarge && (
        <div style={{ height: {md:"70%"}, width: "100%" }}>
          <DataGrid
            getRowId={getRowId}
            checkboxSelection
            disableRowSelectionOnClick
            rows={plants?.map((plant) => {
              return {
                ...plant,
                start: 
                  new Date(plant?.startDate).toDateString()||"undefined",
              };
            })}
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
        </div>
      )}

      {plants?.length > 0 && apiIsLoaded && isLarge && (
        <>
          <PlantSpeedDial
            getPlants={getSelectedPlants}
            {...props}
          />
        </>
      )}
      {plants?.length > 0 && isSmall && (
        <>
          <Grid container spacing={1}>
            {plants.map((obj) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={obj._id}>
                  <PlantCard plant={obj} />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </>
  );
};
PlantsList.propTypes = {
  plants: PropTypes.array,
};
