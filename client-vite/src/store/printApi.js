import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {printerUrl} from "../config/config"

export const printApi = createApi({
  reducerPath: "print/api",
  baseQuery: fetchBaseQuery({
    baseUrl: printerUrl+"/api/printer",
  }),
  endpoints: (build) => ({
    getPrinters: build.query({
      query() {
        return {
          url: `/printers`,
          method: "GET",
        };
      }
    }),
    printTray: build.mutation({
      query(body) {
        return {
          url: `/print_tray`,
          method: "POST",
          body
        };
      }
    }),
  
    printPlants: build.mutation({
      query(body) {
        return {
          url: `/print_plants`,
          method: "POST",
          body
        };
      }
    })
  }),
});

export const { usePrintTrayMutation,usePrintPlantsMutation, useGetPrintersQuery ,refetch} = printApi;
