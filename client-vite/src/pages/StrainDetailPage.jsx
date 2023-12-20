import { Alert,CircularProgress} from "@mui/material";
import { DataGrid,GridToolbar,} from "@mui/x-data-grid";
import { useGetStrainsQuery } from "../store/strainApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

function getRowId(row) {
  return row._id;
}
const columns = [
  { field: "code", headerName: "Code", width: 200 },
  {
    field: "idx",
    headerName: "#",
    width: 100,
    editable: false,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 60,
    editable: false,
  },
];
export const StrainDetailPage = () => {
  const id = useParams().id;
  const navigate=useNavigate()
  const {isLoading,isError,error,data,refetch}=useGetStrainsQuery({_id:id})
  const phenoDetails = (id) => {
    navigate(`/pheno/${id}`)
  };
  useEffect(()=>{
    refetch()
  },[])
  return (
    <>
      {isError&& <Alert severity="error">{error.message}</Alert>}
      {isLoading&& <CircularProgress />}
       { data && <DataGrid
        sx={{width:'100%',alignContent:'center'}}
        getRowId={getRowId}
        rows={data.phenos||[]}
        columns={columns}
        initialState={{}} 
        slots={{
          toolbar: GridToolbar,
        }}
        onCellDoubleClick={(params)=>{phenoDetails(params.row.code+'#'+params.row.idx)}}
      />}
    </>
  );
};
