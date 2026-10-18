import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getOrdersApi } from '../utils/burger-api';

import type { TOrder } from '@utils-types';

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  getOrdersApi
);

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказов';
      });
  },
});

export const { clearProfileOrders } = profileOrdersSlice.actions;
export const profileOrdersReducer = profileOrdersSlice.reducer;
