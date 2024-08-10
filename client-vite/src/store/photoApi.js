import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
export const photoApi = createApi({
  reducerPath: "photo/api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl + "/api/photos",
    refetchOnFocus: true,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token;
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: (build) => ({
    uploadPhotos: build.mutation({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`file${index}`, dataURItoBlob(file));
        });
        return { url: "/upload", method: "POST", files: formData };
      },
    }),
  }),
});

export const { useUploadPhotosMutation } = photoApi;
