import { useNavigate } from "react-router-dom";
import { Alert,CircularProgress} from "@mui/material";
import { DataGrid,GridToolbar,} from "@mui/x-data-grid";
import { useGetPlantsQuery } from "../store/plantsApi";


function getRowId(row) {
  return row._id;
}
const columns = [
  { field: "strain", headerName: "Strain", width: 200 },
  {
    field: "pheno",
    headerName: "Pheno",
    width: 100,
    editable: false,
  },
  {
    field: "type",
    headerName: "Type",
    width: 60,
    editable: false,
  },
  {
    field: "state",
    headerName: "State",
  },
];
export const PlantsPage = () => {
  const navigate = useNavigate();
  const {isLoading,isError,error,data}=useGetPlantsQuery({})
  

  const plantDetails = (id) => {
    navigate(`/plant/${id}`)
  };
  
  return (
    <>
      {isError&& <Alert severity="error">{error.message}</Alert>}
      {isLoading&& <CircularProgress />}
       { data && <DataGrid
        getRowId={getRowId}
        rows={data}
        columns={columns}
        initialState={{}} 
        slots={{
          toolbar: GridToolbar,
        }}
        onCellDoubleClick={(params)=>{plantDetails(params.row._id)}}
      />}
    </>
  );
};
