import { useNavigate } from "react-router-dom";
import { Alert,CircularProgress, Fab} from "@mui/material";
import { DataGrid,GridToolbar,} from "@mui/x-data-grid";
import { useGetStrainsQuery } from "../store/strainApi";
import { NewStrainButton } from "../components/NewStrainButton/NewStrainButton";
function getRowId(row) {
  return row._id;
}
const columns = [
  { field: "name",
   headerName: "Strain name",
    width: 300 },
    { field: "code",
   headerName: "Strain code",
    width: 150 },
  {
    field: "seedBank",
    headerName: "Seed Bank",
    width: 200,
    editable: false,
  },
  {
    field: "sourceType",
    headerName: "Source Type",
    width: 100,
    editable: false,
  },
  {
    field: "seedType",
    headerName: "Seeds Type",
    width: 200,
    editable: false,
  },
  {
    field: "counter",
    headerName: "Counter",
    width: 150,
    editable: false,
  }
];
export const StrainsPage = () => {
  const navigate = useNavigate();
  const {isLoading,isError,error,data,refetch}=useGetStrainsQuery({},{
    refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  }
  )
  

  const plantDetails = (id) => {
    navigate(`/strain/${id}`)
  };
  return (
    <>
      {isError&& <Alert severity="error">{error.message}</Alert>}
      {isLoading&& <CircularProgress />}
       { data && <DataGrid
        sx={{width:'100%',alignContent:'center'}}
        getRowId={getRowId}
        rows={data}
        columns={columns}
        initialState={{}} 
        slots={{
          toolbar: GridToolbar,
        }}
        onCellDoubleClick={(params)=>{plantDetails(params.row._id)}}
      />}
      <NewStrainButton/>
      <Fab onClick={refetch}></Fab>
    </>
  );
};
