import {
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useGetStrainsQuery } from "../store/strainApi";
import { useNavigate, useParams } from "react-router-dom";
import { NewPlantButton } from "../components/NewPlantButton/NewPlantButton";
import { useGetPhotosQuery } from "../store/galleryApi";
import { useEffect, useState } from "react";

function getRowId(row) {
  return row.idx;
}
const columns = [
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
  const [filter, setFilter] = useState("");
  const id = useParams().id;
  const navigate = useNavigate();
  const { isLoading, isError, error, data } = useGetStrainsQuery({
    _id: id,
  });
  const {
    data: photos,
    isPhotoLoading,
    isPhotoLoadingError,
    photoError,
  } = useGetPhotosQuery(
    { strain: filter, state: "Blooming" },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const phenoDetails = (id) => {
    navigate(`/pheno/${id}`);
  };
  // useEffect(()=>{
  //   refetch()
  // },[])
  useEffect(() => {
    if (data?.length > 0) {
      setFilter(data[0].name);
    }
  }, [data]);

  return (
    <>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {photos?.length > 0 && (
        <ImageList
          cols={8}
          rowHeight="200px"
          sx={{ width: "100%" }}
          variant="standard"
        >
          {photos.map((photo, index) => {
            const { src, strain } = photo;
            const thumbnail =
              "thumbnails/" +
              (src?.includes("gallery/") ? src.split("gallery/")[1] : src);
            return (
              <ImageListItem
                onClick={() => {
                  navigate(`${src}`);
                }}
                key={index}
              >
                <img
                  src={`https://ddweed.org/gallery/${thumbnail}`}
                  alt={strain}
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      )}
      {data && (
        <DataGrid
          sx={{ width: "100%", alignContent: "center" }}
          getRowId={getRowId}
          rows={data[0].phenos}
          columns={columns}
          initialState={{}}
          slots={{
            toolbar: GridToolbar,
          }}
          onCellDoubleClick={(params) => {
            phenoDetails(data[0].code + "#" + params.row.idx);
          }}
        />
      )}
      <NewPlantButton strain={id} />
    </>
  );
};
