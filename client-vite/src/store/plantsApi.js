import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";

export const plantsApi = createApi({
  reducerPath: "plants/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/api/plant",
    refetchOnFocus: true,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getPlants: build.query({
      query: (filter) => ({
        url: "plants",
        params: {
          filter: JSON.stringify(filter),
        },
      }),
      providesTags: ["Action", "Plants"],
    }),
    getStrains: build.query({
      query: () => ({
        url: "strains",
      }),
    }),
    getMap: build.query({
      query: () => ({
        url: "plants_map",
      }),
      providesTags: ["Action", "Plants"],
    }),
    getEmptyMap: build.query({
      query: () => ({
        url: "empty_map",
      }),
    }),
    saveMap: build.mutation({
      query(body) {
        return {
          url: `save_map`,
          method: "POST",
          body,
        };
      },
    }),
    getMaps: build.query({
      query: () => ({
        url: "maps",
      }),
    }),
    getPlantCounts: build.query({
      query: () => ({
        url: "plant_counts",
      }),
    }),
    addAction: build.mutation({
      query(body) {
        return {
          url: `new_action`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Action"],
    }),
    newPlant: build.mutation({
      query(body) {
        return {
          url: `new_plant`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Plants"],
    }),
  }),
});

export const {
  useGetPlantsQuery,
  useGetStrainsQuery,
  useGetMapQuery,
  useGetEmptyMapQuery,
  useSaveMapMutation,
  useGetMapsQuery,
  useGetPlantCountsQuery,
  useAddActionMutation,
  useNewPlantMutation,
  refetch,
} = plantsApi;
