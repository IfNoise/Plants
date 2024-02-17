import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "../config/config"

export const cycleApi = createApi({
  reducerPath: "cycle/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl+"/cycle",
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`)
    //   }
    //   return headers
    // },
  }),
  endpoints: (build) => ({
    getCycles: build.query({
      query: (filter) => ({
        url: "",
        params: {
          filter: JSON.stringify(filter),
        },
      }),
      providesTags:['Cycle'],
    }),
    newCycle: build.mutation({
      query(body) {
        return {
          url: `/new`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Cycle'],
    }),
  }),
});

export const { useGetCyclesQuery,useNewCycleMutation } = cycleApi;
