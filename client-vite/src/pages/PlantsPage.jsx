import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useGetPlantsQuery } from "../store/plantsApi";
import { FilterBar } from "../components/FilterBar/FilterBar";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addGroup, addAddress, clearFilter } from "../store/filterSlice";
import { useContext, useEffect } from "react";
import { AppBarContext } from "../context/AppBarContext";
import Scanner from "../components/Scanner/Scanner";
import { TrayButton } from "../components/TrayButton/TrayButton";

export const PlantsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const appBar = useContext(AppBarContext);
  const sFilter = useSelector((state) => state.filter);
  const params = new URLSearchParams(location.search);
  const pFilter = Object.fromEntries(params);

  const {
    isLoading,
    isError,
    error,
    data: plants,
    refetch,
  } = useGetPlantsQuery(
    Object.entries(sFilter).length > 0
      ? { ...sFilter }
      : { state: { $nin: ["Stopped", "Harvested"] } },
    {
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const getData = () => plants?.map((plant) => plant);
  useEffect(() => {

    if (Object.keys(pFilter).length > 0) {
      dispatch(clearFilter());
    }

    Object.keys(pFilter).forEach((key) => {
      const value = pFilter[key];
      if (value === "undefined") return;
      if (key === "group") {
        dispatch(addGroup(value));
      }
      if (
        key === "building" ||
        key === "room" ||
        key === "rack" ||
        key === "shelf" ||
        key === "tray"
      ) {
        const roomName = pFilter.room.split("_").join(" ");
        dispatch(addAddress({ ...pFilter, room: roomName }));
      }
    });
    refetch();
  }, []);
  useEffect(() => {
    if (plants?.length > 0) {
      appBar.setAppBar({
        title: "Plants",
        toolbar: (
          <>
            <Scanner />
            <TrayButton />
          </>
        ),
        right: <FilterBar getData={getData} />,
      });
  }
  }, [plants]);
  
  return (
    <Box>
      {isError && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}
      {plants && (
        <>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 2,
          }}>
            <Typography variant="h6" component="h1" gutterBottom>
              {plants.length} Plants
            </Typography>

            <PlantsList
              plants={plants}
              show
              addPhotos
              addAction
              addToTray
              print
            />
          </Box>
        </>
      )}
    </Box>
  );
};
