import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";

export const deviceApi = createApi({
  reducerPath: "device/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`)
    //   }
    //   return headers
    // },
  }),
  endpoints: (build) => ({
    getDevices: build.query({
      query: () => ({
        url: "devices",
      }),
      providesTags: ["Config"],
    }),
    getConfig: build.query({
      query: (deviceID) => ({
        url: `devices/${deviceID}/getConfig`,
      }),
      providesTags: ["Config"],
    }),
    getState: build.query({
      query: (deviceID) => ({
        url: `devices/${deviceID}/getState`,
      }),
      providesTags: ["Config", "State"],
    }),
    getOutputs: build.query({
      query: (deviceID) => ({
        url: `devices/${deviceID}/getOutputs`,
      }),
      providesTags: ["Config", "State"],
    }),
    call: build.mutation({
      query(deviceId, body) {
        return {
          url: `devices/${deviceId}/call`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["State"],
    }),
    setConfig: build.mutation({
      query({deviceId, params}) {
        return {
          url: `devices/${deviceId}/setconfig`,
          method: "POST",
          body: params,
        };
      },
      invalidatesTags: ["Config", "State"],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useCallMutation,
  useSetConfigMutation,
  useGetConfigQuery,
  useGetOutputsQuery,
  useGetStateQuery,
  refetch,
} = deviceApi;
