import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {baseUrl} from "../config/config"

export const lightApi = createApi({
  reducerPath: "light/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl+"/light/api",
    
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`)
    //   }
    //   return headers
    // },
  }),
  tagTypes:['devices','timers','lightChannels'],
  endpoints: (build) => ({
    getDevices: build.query({
      query: () => ({
        url: "devices",
      }),
      providesTags:['devices'],
    }),
    getDevice: build.query({
      query: (name) => ({
        url: `devices/${name}`,
      }),
      providesTags: (result, error, name) =>[{type:'devices',name}],
    }),
    getTimers: build.query({
      query: () => ({
        url: "timers",
      }),
      providesTags:['timers'],
    }),
    getTimer: build.query({
      query: (name) => ({
        url: `timers/${name}`,
      }),
      providesTags: (result, error, name) =>[{type:'timers',name}],
    }),
    getLightChannels: build.query({
      query: () => ({
        url: "lightChannels",
      }),
      providesTags:['lightChannels'],
    }),
    getLightChannel: build.query({
      query: (name) => ({
        url: `lightChannels/${name}`,
      }),
      providesTags: (result, error, name) =>[{type:'lightChannels',name}],
    }),
    getLightChannelState: build.query({
      query: (name) => ({
        url: `lightChannels/${name}/state`,
      }),
      providesTags: (result, error, name) =>[{type:'lightChannels',name}],
    }),

    addDevice: build.mutation({
      query: (device) => ({
        url: "devices/add",
        method: "POST",
        body: device,
      }),
      invalidatesTags:['devices']
    }),
    removeDevice: build.mutation({
      query: (name) => ({
        url: `devices/${name}`,
        method: "DELETE",
      }),
      invalidatesTags:['devices']
    }),
    updateDevice: build.mutation({
      query: ({ name, device }) => ({
        url: `devices/${name}`,
        method: "PATCH",
        body: device,
      }),
      invalidatesTags:['devices']
    }),
    addTimer: build.mutation({
      query: (timer) => ({
        url: "timers/add",
        method: "POST",
        body: timer,
      }),
      invalidatesTags:['timers']
    }),
    removeTimer: build.mutation({
      query: (name) => ({
        url: "timers/remove",
        method: "POST",
        body: { name },
      }),
      invalidatesTags:['timers']
    }),
    setSteps: build.mutation({
      query: ({ name, steps }) => ({
        url: `timers/${name}/setSteps`,
        method: "POST",
        body: { steps },
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name}],
    }),
    subscribe: build.mutation({
      query: ({ name, channels }) => ({
        url: `timers/${name}/subscribe`,
        method: "POST",
        body: { channels },
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name},{type:'lightChannels'}],
    }),
    unsubscribe: build.mutation({
      query: ({ name, channels }) => ({
        url: `timers/${name}/unsubscribe`,
        method: "POST",
        body: { channels },
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name},{type:'lightChannels'}],
    }),
    startTimer: build.mutation({
      query: ({ name}) => ({
        url: `timers/${name}/start`,
        method: "POST",
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name}],
    }),
    stopTimer: build.mutation({
      query: ({ name}) => ({
        url: `timers/${name}/stop`,
        method: "POST",
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name}],
    }),
    addChannel: build.mutation({
      query: (channel) => ({
        url: "lightChannels/add",
        method: "POST",
        body: channel,
      }),
      invalidatesTags:['lightChannels']
    }),
    removeChannel: build.mutation({
      query: (name) => ({
        url: "lightChannels/remove",
        method: "POST",
        body: { name },
      }),
      invalidatesTags:['lightChannels']
    }),
    setMaxLevel: build.mutation({
      query: ({ name, maxLevel }) => ({
        url: `lightChannels/${name}/setMaxLevel`,
        method: "POST",
        body: { maxLevel },
      }),
      invalidatesTags:['lightChannels'],
    }),
    setSunriseTime: build.mutation({
      query: ({ name, time }) => ({
        url: `timers/${name}/setSunriseTime`,
        method: "POST",
        body: { time },
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name}],
    }),
    setSunsetTime: build.mutation({
      query: ({ name, time }) => ({
        url: `timers/${name}/setSunsetTime`,
        method: "POST",
        body: { time },
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name}],
    }),
    setStepTime: build.mutation({
      query: ({ name, stepTime }) => ({
        url: `timers/${name}/setStepTime`,
        method: "POST",
        body: { stepTime },
      }),
      invalidatesTags:(result, error, { name }) =>[{type:'timers',name}]
  }),
  })
})


export const { useGetDevicesQuery,useGetTimersQuery,useGetLightChannelsQuery,
  useGetDeviceQuery,useGetTimerQuery,useGetLightChannelQuery,useSetStepTimeMutation,
  useAddDeviceMutation,useRemoveDeviceMutation,useUpdateDeviceMutation,useStartTimerMutation,useStopTimerMutation,
  useAddTimerMutation,useRemoveTimerMutation,useGetLightChannelStateQuery,
  useSetStepsMutation,useSubscribeMutation,useUnsubscribeMutation,
  useAddChannelMutation,useRemoveChannelMutation,
  useSetMaxLevelMutation,useSetSunriseTimeMutation,useSetSunsetTimeMutation,useSetStepMutation
 } = lightApi;
