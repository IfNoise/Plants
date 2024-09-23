import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedingApi = createApi({
  reducerPath: "feeding/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:7000/api/feeding",
    refetchOnFocus: true,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token;
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  //================================================================================================
  // getAllFertilizers,
  // createFertilizer,
  // getFertilizerById,
  // deleteFertilizer,
  // getAllElements,
  // addElement,
  // updateElement,
  // deleteElement

  endpoints: (build) => ({
    getAllFertilizers: build.query({
      query: () => {
        return {
          url: "/fertilizers",
          method: "GET",
        };
      },
      providesTags: ["Fertilizers"],
    }),

    createFertilizer: build.mutation({
      query: (body) => {
        return {
          url: "/fertilizers",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Fertilizers"],
    }),
    getFertilizerById: build.query({
      query: (id) => {
        return {
          url: `/fertilizers/${id}`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [{ type: "Fertilizers", id }],
    }),
    deleteFertilizer: build.mutation({
      query: (id) => {
        return {
          url: `/fertilizers/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Fertilizers"],
    }),
    getAllElements: build.query({
      query: (id) => {
        return {
          url: `/fertilizers/${id}/elements/`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [{ type: "Fertilizers", id }],
    }),
    addElement: build.mutation({
      query: ({id,body}) => {
        return {
          url: `/fertilizers/${id}/elements`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Fertilizers"],
    }),
    updateElement: build.mutation({
    query: ({id,elementId, body}) => {
        return {
          url: `/fertilizers/${id}/elements/${elementId}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Fertilizers"],
    }),
    deleteElement: build.mutation({
      query: ({id,elementId}) => {
        return {
          url: `/fertilizers/${id}/elements/${elementId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Fertilizers"],
    }),
    //================================================================================================
    // getAllConcentrates,
    // createConcentrate,
    // getConcentrateById,
    // deleteConcentrate,
    // getAllFertilizers,
    // addFertilizer,
    // updateFertilizer,
    // deleteFertilizerFromConc,
    getAllConcentrates: build.query({
      query: () => {
        return {
          url: "/concentrates",
          method: "GET",
        };
      },
      providesTags: ["Concentrates"],
    }),
    createConcentrate: build.mutation({
      query: (body) => {
        return {
          url: "/concentrates",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Concentrates"],
    }),
    getConcentrateById: build.query({
      query: (id) => {
        return {
          url: `/concentrates/${id}`,
          method: "GET",
        };
      },
      providesTags:["Concentrates"],
    }),
    deleteConcentrate: build.mutation({
      query: (id) => {
        return {
          url: `/concentrates/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Concentrates"],
    }),
    addFertilizer: build.mutation({
      query: ({id,body}) => {
        return {
          url: `/concentrates/${id}/fertilizers`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Concentrates"],
    }),
    updateFertilizer: build.mutation({
      query: ({id,elementId, body}) => {
        return {
          url: `/concentrates/${id}/fertilizers/${elementId}`,
          method: "PATCH",
          body,
        };
      },
    }),
    deleteFertilizerFromConc: build.mutation({
      query: ({id,elementId}) => {
        return {
          url: `/concentrates/${id}/fertilizers/${elementId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Concentrates"],
    }),
    //================================================================================================
    // getAllWaters,
    // createWater,
    // getWaterById,
    // updateWater,
    // deleteWater,
    // getAllElements,
    // addElement,
    // getElementById,
    // updateElement,
    // deleteElement
    getAllWaters: build.query({
      query: () => {
        return {
          url: "/waters",
          method: "GET",
        };
      },
    }),
    createWater: build.mutation({
      query: (body) => {
        return {
          url: "/waters",
          method: "POST",
          body,
        };
      },
    }),
    getWaterById: build.query({
      query: (id) => {
        return {
          url: `/waters/${id}`,
          method: "GET",
        };
      },
    }),
    updateWater: build.mutation({
      query: (id, body) => {
        return {
          url: `/waters/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    deleteWater: build.mutation({
      query: (id) => {
        return {
          url: `/waters/${id}`,
          method: "DELETE",
        };
      },
    }),
    getWaterElementById: build.query({
      query: (id) => {
        return {
          url: `/elements/${id}`,
          method: "GET",
        };
      },
    }),
    updateWaterElement: build.mutation({
      query: (id, body) => {
        return {
          url: `/elements/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    deleteWaterElement: build.mutation({
      query: (id) => {
        return {
          url: `/elements/${id}`,
          method: "DELETE",
        };
      },
    }),
    //================================================================================================
    // getAllReciepts,
    // createReciept,
    // getRecieptById,
    // updateReciept,
    // deleteReciept
    getAllReciepts: build.query({
      query: () => {
        return {
          url: "/reciepts",
          method: "GET",
        };
      },
    }),
    createReciept: build.mutation({
      query: (body) => {
        return {
          url: "/reciepts",
          method: "POST",
          body,
        };
      },
    }),
    getRecieptById: build.query({
      query: (id) => {
        return {
          url: `/reciepts/${id}`,
          method: "GET",
        };
      },
    }),
    updateReciept: build.mutation({
      query: (id, body) => {
        return {
          url: `/reciepts/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    deleteReciept: build.mutation({
      query: (id) => {
        return {
          url: `/reciepts/${id}`,
          method: "DELETE",
        };
      },
    }),
    //================================================================================================
    // createFertilizerUnit,
    // getFertilizerUnits,
    // getFertilizerUnit,
    // updateFertilizerUnit,
    // deleteFertilizerUnit,
    // addPumpToFertilizerUnit,
    // removePumpFromFertilizerUnit,
    // updatePumpFromFertilizerUnit
    createFertilizerUnit: build.mutation({
      query: (body) => {
        return {
          url: "/fertilizer-units",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["FertilizerUnits"],
    }),
    getFertilizerUnits: build.query({
      query: () => {
        return {
          url: "/fertilizer-units",
          method: "GET",
        };
      },
      providesTags: ["FertilizerUnits"],
    }),
    getFertilizerUnit: build.query({
      query: (id) => {
        return {
          url: `/fertilizer-units/${id}`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [{ type: "FertilizerUnits", id }],
    }),
    updateFertilizerUnit: build.mutation({
      query: ({id, body}) => {
        return {
          url: `/fertilizer-units/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "FertilizerUnits", id }],
    }),
    deleteFertilizerUnit: build.mutation({
      query: (id) => {
        return {
          url: `/fertilizer-units/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "FertilizerUnits", id }],
    }),
    getFertilizerUnitPumps: build.query({
      query: (id) => {
        return {
          url: `/fertilizer-units/${id}/pumps`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [{ type: "FertilizerUnits", id }],
    }),
    addPumpToFertilizerUnit: build.mutation({
      query: ({id, body}) => {
        return {
          url: `/fertilizer-units/${id}/pumps`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "FertilizerUnits", id }],
    }),
    removePumpFromFertilizerUnit: build.mutation({
      query: ({id, pumpId}) => {
        return {
          url: `/fertilizer-units/${id}/pumps/${pumpId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "FertilizerUnits", id }],
    }),
    updatePumpFromFertilizerUnit: build.mutation({
      query: ({id, pumpId, body}) => {
        return {
          url: `/fertilizer-units/${id}/pumps/${pumpId}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "FertilizerUnits", id }],
    }),
    //================================================================================================
  }),
});


export const {
  useGetAllFertilizersQuery,
  useCreateFertilizerMutation,
  useGetFertilizerByIdQuery,
  useDeleteFertilizerMutation,
  useGetAllElementsQuery,
  useAddElementMutation,
  useUpdateElementMutation,
  useDeleteElementMutation,
  useGetAllConcentratesQuery,
  useCreateConcentrateMutation,
  useGetConcentrateByIdQuery,
  useDeleteConcentrateMutation,
  useAddFertilizerMutation,
  useUpdateFertilizerMutation,
  useDeleteFertilizerFromConcMutation,
  useGetAllWatersQuery,
  useCreateWaterMutation,
  useGetWaterByIdQuery,
  useUpdateWaterMutation,
  useDeleteWaterMutation,
  useGetWaterElementByIdQuery,
  useUpdateWaterElementMutation,
  useDeleteWaterElementMutation,
  useGetAllRecieptsQuery,
  useCreateRecieptMutation,
  useGetRecieptByIdQuery,
  useUpdateRecieptMutation,
  useDeleteRecieptMutation,
  useCreateFertilizerUnitMutation,
  useGetFertilizerUnitsQuery,
  useGetFertilizerUnitQuery,
  useUpdateFertilizerUnitMutation,
  useDeleteFertilizerUnitMutation,
  useGetFertilizerUnitPumpsQuery,
  useAddPumpToFertilizerUnitMutation,
  useRemovePumpFromFertilizerUnitMutation,
  useUpdatePumpFromFertilizerUnitMutation,
} = feedingApi;