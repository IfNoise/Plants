import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../config/config'

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl+'/api/auth',
    prepareHeaders: (headers, { getState }) => {
      const token = getState() .auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: 'register',
        method: 'POST',
        body: credentials,
      }),
    }),
    protected: builder.mutation({
      query: () => 'protected',
    }),
  }),
})

export const { useLoginMutation,useRegisterMutation, useProtectedMutation } = authApi