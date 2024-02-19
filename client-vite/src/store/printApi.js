import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {printerUrl} from "../config/config"

export const printApi = createApi({
  reducerPath: "print/api",
  baseQuery: fetchBaseQuery({
    baseUrl: printerUrl
  }),
  endpoints: (build) => ({
    printTray: build.mutation({
      query() {
        return {
          url: `/print_tray`,
          method: "POST",
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

export const { usePrintTrayMutation,usePrintPlantsMutation } = printApi;
