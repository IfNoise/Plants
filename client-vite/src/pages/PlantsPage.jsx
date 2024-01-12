import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Fab} from "@mui/material";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useGetPlantsQuery } from "../store/plantsApi";
import { useAddToTrayMutation } from "../store/trayApi";
function getRowId(row) {
  return row._id;
}
const fabStyle = {
  position: "fixed",
  bottom: 16,
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
  const [addToTray] = useAddToTrayMutation();
  const plantDetails = (id) => {
    navigate(`/plant/${id}`);
  };

  
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
        sx={fabStyle}
        onClick={() => {
          addToTray(Array.from(apiRef.current.getSelectedRows().keys()));
        }}
      >
        <CreateNewFolderIcon />
      </Fab>
    </>
  );
};
