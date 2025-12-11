import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://ddweed.org/api/v1/feeding";
//const baseUrl = "http://localhost:3000/api/v1/feeding";

export const feedingApi = createApi({
  reducerPath: "feeding/api",
  baseQuery: fetchBaseQuery({
    baseUrl,
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
      query: ({ id, body }) => {
        return {
          url: `/fertilizers/${id}/elements`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Fertilizers"],
    }),
    updateElement: build.mutation({
      query: ({ id, elementId, body }) => {
        return {
          url: `/fertilizers/${id}/elements/${elementId}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Fertilizers"],
    }),
    deleteElement: build.mutation({
      query: ({ id, elementId }) => {
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
      providesTags: ["Concentrates"],
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
      query: ({ id, body }) => {
        return {
          url: `/concentrates/${id}/fertilizers`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Concentrates"],
    }),
    updateFertilizer: build.mutation({
      query: ({ id, elementId, body }) => {
        return {
          url: `/concentrates/${id}/fertilizers/${elementId}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Concentrates"],
    }),
    deleteFertilizerFromConc: build.mutation({
      query: ({ id, elementId }) => {
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
      providesTags: ["Waters"],
    }),
    createWater: build.mutation({
      query: (body) => {
        return {
          url: "/waters",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Waters"],
    }),
    getWaterById: build.query({
      query: (id) => {
        return {
          url: `/waters/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Waters"],
    }),
    updateWater: build.mutation({
      query: (id, body) => {
        return {
          url: `/waters/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Waters"],
    }),
    deleteWater: build.mutation({
      query: (id) => {
        return {
          url: `/waters/${id}`,
          method: "DELETE",
        };
      },
    }),
    addElementToWater: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `/waters/${id}/elements`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Waters"],
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
      query: ({ id, elementId, body }) => {
        return {
          url: `/waters/${id}/elements/${elementId}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Waters"],
    }),
    deleteWaterElement: build.mutation({
      query: ({ id, elementId }) => {
        return {
          url: `/waters/${id}/elements/${elementId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Waters"],
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
          url: "/recipes",
          method: "GET",
        };
      },
      providesTags: ["Reciepts"],
    }),
    createReciept: build.mutation({
      query: (body) => {
        return {
          url: "/recipes",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Reciepts"],
    }),
    getRecieptById: build.query({
      query: (id) => {
        return {
          url: `/recipes/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Reciepts"],
    }),
    updateReciept: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `/recipes/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Reciepts"],
    }),
    deleteReciept: build.mutation({
      query: (id) => {
        return {
          url: `/recipes/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Reciepts"],
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
      query: ({ id, body }) => {
        return {
          url: `/fertilizer-units/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["FertilizerUnits"],
    }),
    deleteFertilizerUnit: build.mutation({
      query: (id) => {
        return {
          url: `/fertilizer-units/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["FertilizerUnits"],
    }),
    getFertilizerUnitPumps: build.query({
      query: (id) => {
        return {
          url: `/fertilizer-units/${id}/pumps`,
          method: "GET",
        };
      },
      providesTags: ["FertilizerUnits"],
    }),
    addPumpToFertilizerUnit: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `/fertilizer-units/${id}/pumps`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["FertilizerUnits"],
    }),
    removePumpFromFertilizerUnit: build.mutation({
      query: ({ id, pumpId }) => {
        return {
          url: `/fertilizer-units/${id}/pumps/${pumpId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["FertilizerUnits"],
    }),
    updatePumpFromFertilizerUnit: build.mutation({
      query: ({ id, pumpId, body }) => {
        return {
          url: `/fertilizer-units/${id}/pumps/${pumpId}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["FertilizerUnits"],
    }),
    //================================================================================================
    createProgram: build.mutation({
      query: (body) => {
        return {
          url: "/programs",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Program"],
    }),
    getAllPrograms: build.query({
      query: () => {
        return {
          url: "/programs",
          method: "GET",
        };
      },
      providesTags: ["Program"],
    }),
    getProgramById: build.query({
      query: (id) => {
        return {
          url: `/programs/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Program"],
    }),
    updateProgram: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `/programs/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Program"],
    }),
    deleteProgram: build.mutation({
      query: (id) => {
        return {
          url: `/programs/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Program"],
    }),
    //================================================================================================
    createStage: build.mutation({
      query: (body, programId, id) => {
        return {
          url: `/programs/${programId}/stages/${id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Stage"],
    }),
    getAllStages: build.query({
      query: (id) => {
        return {
          url: `/programs/${id}/stages`,
          method: "GET",
        };
      },
      providesTags: ["Stage"],
    }),
    getStageById: build.query({
      query: (id) => {
        return {
          url: `/stages/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Stage"],
    }),
    updateStage: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `/stages/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Stage"],
    }),
    deleteStage: build.mutation({
      query: (id) => {
        return {
          url: `/stages/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Stage"],
    }),
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
  useAddElementToWaterMutation,
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
  useCreateProgramMutation,
  useGetAllProgramsQuery,
  useGetProgramByIdQuery,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useCreateStageMutation,
  useGetAllStagesQuery,
  useGetStageByIdQuery,
  useUpdateStageMutation,
  useDeleteStageMutation,
} = feedingApi;
