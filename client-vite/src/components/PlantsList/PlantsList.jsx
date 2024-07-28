import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  List,
  Pagination,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useCallback } from "react";
import { DataGrid,  useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import PlantSpeedDial from "../PlantSpeedDial/PlantSpeedDial";
import PlantListItem from "../PlantListItem/PlantListItem";
function getRowId(row) {
  return row._id;
}

const columns = [
  { field: "strain", headerName: "Strain", width: 230 },
  {
    field: "pheno",
    headerName: "Pheno",
    width: 80,
    editable: false,
  },
  {
    field: "type",
    headerName: "Type",
    width: 70,
    editable: false,
    color: "green",
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 80,
    editable: false,
  },
  {
    field: "state",
    headerName: "State",
    width: 100,
    editable: false,
  },
  {
    field: "start",
    headerName: "Started",
    width: 140,
    editable: false,
  },
  {
    field: "group",
    headerName: "Group",
    width: 150,
    editable: false,
  },
];
function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export const PlantsList = (props) => {
  const plants = props?.plants || [];

  const navigate = useNavigate();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isLarge = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const apiRef = useGridApiRef(null);
  const [apiIsLoaded, setApiIsLoaded] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  //const [sel, setSel] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const plantDetails = (id) => {
    navigate(`/plant/${id}`);
  };
  const selectAll = () => {
    setAllSelected(true);
    setSelectedPlants([...plants]);
  };

  const getSelected = useCallback(() => {
    if (Object.keys(apiRef.current).length === 0) {
      return [];
    }
    return Array.from(apiRef.current.getSelectedRows().keys());
  }, [apiRef]);

  const getSelectedPlants = useCallback(() => {
    if (!apiRef.current) {
      return [];
    }
    if (Object.keys(apiRef.current).length === 0) {
      return [];
    }
    return Array.from(apiRef.current.getSelectedRows().values());
  }, [apiRef]);

  const checkboxSelectionHandler = () => {
    setSelectedPlants(getSelected());
  };

  useEffect(() => {
    if (Object.keys(apiRef.current).length === 0) {
      return;
    }
    setApiIsLoaded(true);

    apiRef.current.subscribeEvent(
      "rowSelectionCheckboxChange",
      checkboxSelectionHandler
    );
    apiRef.current.subscribeEvent(
      "headerSelectionCheckboxChange",
      checkboxSelectionHandler
    );
  }, [apiRef]);
  const plantsPerPage = 100;
  return (
    <Box sx={{ display: "flow", height: "100%",right:0,ml:0,pl:0  }}>
      {plants?.length < 1 && <CircularProgress />}
      {plants?.length > 0 && isLarge && (
        <Box sx={{ height: { md: "60vh", lg: "78vh" },}}>
          <DataGrid
            getRowId={getRowId}
            checkboxSelection
            maxHeight="100%" //{{md:"70%",lg:"80%"}}
            disableRowSelectionOnClick
            rows={plants?.map((plant) => {
              return {
                ...plant,
                start: new Date(plant?.startDate).toDateString() || "undefined",
              };
            })}
            apiRef={apiRef}
            columns={columns}
            initialState={{}}
            onCellDoubleClick={(params) => {
              plantDetails(params.row._id);
            }}
          />
        </Box>
      )}

      {plants?.length > 0 && apiIsLoaded && isLarge && (
        <>
          <PlantSpeedDial getPlants={getSelectedPlants} {...props} />
        </>
      )}
      {plants?.length > 0 && isSmall && (
        <>
          <Stack direction="row" spacing={0.5}>
            <Pagination
              count={Math.floor(plants.length / plantsPerPage) + 1}
              page={page}
              sx={{ top: 180, position: "revert", m: 1 }}
              onChange={(e, value) => {
                setPage(value);
              }}
            />
            <FormControlLabel
              label="Select All"
              labelPlacement="start"
              control={
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      selectAll();
                    } else {
                      setSelectedPlants([]);
                      setAllSelected(false);
                    }
                  }}
                />
              }
            />
          </Stack>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              //position: "relative",
              overflow: "auto",
              ml: 0,
              mr: 0,
              maxHeight: "70vh",
            }}
          >
            {paginate(plants, plantsPerPage, page).map((obj,i) => {
              return (
                <PlantListItem
                  key={i}
                  plant={obj}
                  checked={selectedPlants.indexOf(obj) !== -1}
                  onClick={plantDetails}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedPlants((prev) => {
                        if (prev.indexOf(obj) === -1) {
                          return [...prev, obj];
                        }
                        return prev;
                      });
                    } else {
                      setSelectedPlants((prev) => {
                        return prev.filter((item) => item !== obj);
                      });
                      setAllSelected(false);
                    }
                    
                  }}
                />
              );
            })}
          </List>
          {selectedPlants.length > 0 && (
            <PlantSpeedDial getPlants={()=>{
              return selectedPlants;
            }} {...props} />
          )}
        </>
      )}
    </Box>
  );
};
PlantsList.propTypes = {
  plants: PropTypes.array,
};
