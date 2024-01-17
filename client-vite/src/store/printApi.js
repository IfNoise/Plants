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
          url: `/`,
          method: "POST",
        };
      }
    })
  }),
});

export const { usePrintTrayMutation } = printApi;
