import { Alert, CircularProgress} from "@mui/material";
import { PlantsList } from "../components/PlantsList/PlantsList";
import { useGetTrayQuery } from "../store/trayApi";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppBarContext } from "../context/AppBarContext";
import { TrayButton } from "../components/TrayButton/TrayButton";
import Scanner from "../components/Scanner/Scanner";
import {FilterBar} from '../components/FilterBar/FilterBar'

export const TrayPage = () => {
  const [filter,setFilter]=useState({})
  const {
    isLoading,
    isError,
    error,
    data,
    refetch
    
  } = useGetTrayQuery(filter,{ 
    refetchOnMountOrArgChange: true, 
    refetchOnFocus: true ,
    refetchOnReconnect:true,
    refetchOnMount:true
  });
  const appBar = useContext(AppBarContext);
  useEffect(() => {
    refetch();
  }
  , [refetch]);
  
  useEffect(() => {
    if(data?.length===0)return
    appBar.setAppBar({ title: "Tray" ,
    toolbar: (
          <>
            <Scanner />
            <TrayButton />
          </>
        ),
        right: <FilterBar setOutputFilter={setFilter} getData={()=>data } />,
  });
  } , [data]);
  return (
    <>
      {isError && <Alert severity="error">{error?.message||'error'}</Alert>}
      {isLoading && <CircularProgress />}
      {data?.length>0 &&
        <PlantsList
          plants={data}
          show
          addAction
          addToTray
          printTray
          print
          clearTray
        />
      }
    </>
  );
};
