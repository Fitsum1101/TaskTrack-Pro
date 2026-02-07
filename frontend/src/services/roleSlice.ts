import { RoleFormDataType } from "@/app/dashboard/roles/_schema/role";
import { apiSlice } from "@/store/apiSlice";
import { Role, RoleQueryParamsType, RolesResponse } from "@/types/role";

const prefix = "/api/v1/role";

export const roleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==============================
    // PUBLIC ROUTES
    // ==============================
    getAllPublicRoles: builder.query({
      query: (params: RoleQueryParamsType) => ({
        url: `${prefix}/public`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data as RolesResponse,
      providesTags: ["role"],
    }),

    // ==============================
    // PRIVATE ROUTES
    // ==============================
    getAllRoles: builder.query({
      query: (params: RoleQueryParamsType) => ({
        url: `${prefix}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data as RolesResponse,
      providesTags: ["role"],
    }),

    getRoleById: builder.query({
      query: (id) => ({ url: `${prefix}/${id}`, method: "GET" }),
      transformResponse: (response) => response.data as Role,
      providesTags: (_result, _error, id) => [{ type: "role", id }],
    }),

    createRole: builder.mutation<void, RoleFormDataType>({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["role"],
    }),

    updateRole: builder.mutation<void, RoleFormDataType & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "role", id },
        "role",
      ],
    }),

    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["role"],
    }),
  }),
});

export const {
  useGetAllPublicRolesQuery,
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApiSlice;
