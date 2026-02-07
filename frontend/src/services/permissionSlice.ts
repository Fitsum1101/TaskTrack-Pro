import { apiSlice } from "@/store/apiSlice";
import {
  PermissionQueryParamsType,
  PermissionsResponse,
} from "@/types/permission";

const prefix = "/api/v1/permission";
const permissionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==============================
    // PUBLIC ROUTES
    // ==============================
    getAllPublicPerrmissions: builder.query({
      query: (params: PermissionQueryParamsType) => ({
        url: `${prefix}/public`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data as PermissionsResponse,
      providesTags: ["role", "permission"],
    }),
    // ==============================
    // PRIVATE ROUTES
    // ==============================
    getAllPermissions: builder.query({
      query: (params: PermissionQueryParamsType) => ({
        url: `${prefix}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data as PermissionsResponse,
      providesTags: ["role", "permission"],
    }),
    getPermissionsById: builder.query({
      query: (id: string) => ({
        url: `${prefix}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        "role",
        "permission",
        { type: "role", id },
      ],
    }),

    createPermission: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["role", "permission"],
    }),
    updatePermission: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_result, _error, id) => [
        "role",
        "permission",
        { type: "role", id },
      ],
    }),
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "role",
        "permission",
        { type: "role", id },
      ],
    }),
  }),
});

export const {
  useGetAllPublicPerrmissionsQuery,
  useGetAllPermissionsQuery,
  useGetPermissionsByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApiSlice;
