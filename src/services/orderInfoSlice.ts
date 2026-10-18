import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '../utils/burger-api';

import type { TOrder } from '@utils-types';

export const fetchOrderInfo = createAsyncThunk(
  'orderInfo/fetchOrderInfo',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

type OrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderInfoState = {
  order: null,
  isLoading: false,
  error: null,
};

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderInfo.pending, (state) => {
        state.isLoading = true;
        state.order = null;
        state.error = null;
      })
      .addCase(fetchOrderInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  },
});

export const { clearOrderInfo } = orderInfoSlice.actions;
export const orderInfoReducer = orderInfoSlice.reducer;
