import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";
function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
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
        formData.append("file", dataURItoBlob(files)); // your frontend and backend file name "file" might have to be the same
        return { url: "/upload", method: "POST", body: formData ,formData:true};
      },
    }),
  }),
});

export const { useUploadPhotosMutation } = photoApi;
