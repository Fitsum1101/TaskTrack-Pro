import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthUserProfile } from "@/types/new/user";
import { getItemFromLocalDb, setItemLocalDb } from "@/lib/localDb";
import { ACCESS_TOKEN, REFRESH_TOKEN, AUTH_USER } from "@/constant/variables";
import type { AuthState } from "@/types/new/auth";
import { safeJSONParse } from "@/utils/safeJSONParse";

// Initial state
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Helper to get initial state from localStorage
const getInitialState = (): AuthState => {
  const accessToken = getItemFromLocalDb(ACCESS_TOKEN);
  const refreshToken = getItemFromLocalDb(REFRESH_TOKEN);
  const userRaw = getItemFromLocalDb(AUTH_USER);
  const user = safeJSONParse(userRaw);

  if (accessToken && refreshToken && user) {
    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    };
  }

  return initialState;
};

// Fetch user profile from API
// export const fetchAuthData = createAsyncThunk<AuthUserProfile | null>(
//   "auth/fetchAuthData",
//   async (_, { rejectWithValue, dispatch }) => {
//     try {
//       const result = await dispatch(
//         authApiSlice.endpoints.profile.initiate(undefined),
//       ).unwrap();
//       return result || null;
//     } catch (error: any) {
//       return rejectWithValue(error?.data || error.message);
//     }
//   },
// );

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action: PayloadAction<AuthUserProfile>) => {
      state.user = action.payload as any;
      state.isAuthenticated = true;
      setItemLocalDb(AUTH_USER, JSON.stringify(action.payload));
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      setItemLocalDb(ACCESS_TOKEN, action.payload.accessToken);
      setItemLocalDb(REFRESH_TOKEN, action.payload.refreshToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(AUTH_USER);
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchAuthData.fulfilled, (state, action) => {
  //     if (action.payload) {
  //       state.user = action.payload as any;
  //       state.isAuthenticated = true;
  //     }
  //     state.isLoading = false;
  //   });
  //   builder.addCase(fetchAuthData.rejected, (state) => {
  //     state.user = null;
  //     state.accessToken = null;
  //     state.refreshToken = null;
  //     state.isAuthenticated = false;
  //     state.isLoading = false;
  //   });
  // },
});

// Export actions
export const { setUser, setTokens, logout } = authSlice.actions;

// Selectors
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

// Export reducer
export default authSlice.reducer;
