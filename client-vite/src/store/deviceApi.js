import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";

export const deviceApi = createApi({
  reducerPath: "device/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/api/v2",
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
      transformResponse: (response) => {
        // Если ответ уже массив, возвращаем как есть (старый формат)
        if (Array.isArray(response)) {
          return response;
        }
        // Если ответ с полем data, извлекаем его (новый формат)
        if (response?.data) {
          return response.data;
        }
        // Если ответ с полем success, извлекаем data (новый формат v2)
        if (response?.success && response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ["Config"],
    }),
    // Новый эндпоинт для получения конфигурации
    getConfig: build.query({
      query: (deviceId) => ({
        url: `devices/${deviceId}/config`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Извлекаем config из ответа, если он обернут
        if (response?.config) {
          return response.config;
        }
        return response;
      },
      providesTags: ["Config"],
    }),
    // Новый эндпоинт для обновления конфигурации
    setConfig: build.mutation({
      query: ({ deviceId, config, reboot = false }) => ({
        url: `devices/${deviceId}/config`,
        method: "PATCH",
        body: { config, reboot },
      }),
      invalidatesTags: ["Config", "State"],
    }),
    getState: build.query({
      query: (deviceId) => ({
        url: `devices/${deviceId}/state`,
        method: "GET",
      }),
      transformResponse: (response) => {
        if (response?.state) {
          return response.state;
        }
        if (response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ["Config", "State"],
    }),
    getOutputs: build.query({
      query: (deviceId) => ({
        url: `devices/${deviceId}/outputs`,
        method: "GET",
      }),
      transformResponse: (response) => {
        if (response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: ["Config", "State"],
    }),
    // Универсальный метод для работы с любым компонентом
    getComponentData: build.query({
      query: ({
        deviceId,
        componentType,
        componentKey,
        source = "metadata",
      }) => ({
        url: `devices/${deviceId}/${componentType}/${componentKey}`,
        method: "GET",
        params: { source },
      }),
      providesTags: (result, error, { componentType, componentKey }) => [
        { type: componentType, id: componentKey },
      ],
    }),
    setComponentData: build.mutation({
      query: ({ deviceId, componentType, componentKey, data }) => ({
        url: `devices/${deviceId}/${componentType}/${componentKey}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { componentType, componentKey }) => [
        { type: componentType, id: componentKey },
        "Config",
      ],
    }),
    call: build.mutation({
      query(deviceId, body) {
        return {
          url: `devices/${deviceId}/call`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["State", "Config"],
    }),
    // Новый специализированный эндпоинт для irrigation table
    getIrrigationTable: build.query({
      query: ({ deviceId, irrigatorKey, source = "metadata" }) => ({
        url: `devices/${deviceId}/irrigators/${irrigatorKey}/irrigation-table`,
        method: "GET",
        params: { source },
      }),
      transformResponse: (response) => {
        // Новый API возвращает { success, irrigationTable, strategyParams }
        if (response?.irrigationTable !== undefined) {
          return {
            result: {
              items: response.irrigationTable,
            },
            strategyParams: response.strategyParams || {},
          };
        }
        // Старый формат (совместимость)
        return response;
      },
      providesTags: (result, error, { irrigatorKey }) => [
        { type: "IrrigationTable", id: irrigatorKey },
      ],
    }),
    setIrrigationTable: build.mutation({
      query: ({ deviceId, irrigatorKey, irrigationTable, strategyParams }) => ({
        url: `devices/${deviceId}/irrigators/${irrigatorKey}/irrigation-table`,
        method: "POST",
        body: {
          irrigationTable,
          strategyParams,
        },
      }),
      invalidatesTags: (result, error, { irrigatorKey }) => [
        { type: "IrrigationTable", id: irrigatorKey },
        "Config",
      ],
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
  useGetComponentDataQuery,
  useSetComponentDataMutation,
  useGetIrrigationTableQuery,
  useSetIrrigationTableMutation,
  refetch,
} = deviceApi;
