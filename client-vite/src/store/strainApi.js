import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "../config/config"

export const strainApi = createApi({
  reducerPath: "strain/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl+"/api/strain",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (build) => ({
    getStrains: build.query({
      query: (filter) => ({
        url: "",
        params: {
          filter: JSON.stringify(filter),
        },
      }),
      providesTags:['Strain'],
    }),
    addStrain: build.mutation({
      query(body) {
        return {
          url: `/add`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ['Strain'],
    }),
  }),
});

export const { useGetStrainsQuery,useAddStrainMutation } = strainApi;
