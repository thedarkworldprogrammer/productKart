import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create Order
export const createOrder = createAsyncThunk('order/create', async (order, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo }
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post(`/api/orders`, order, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Get Order Details
export const getOrderDetails = createAsyncThunk('order/details', async (id, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo }
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/orders/${id}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Pay Order (Not used for COD but good to keep structure)
export const payOrder = createAsyncThunk('order/pay', async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo }
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Deliver Order (Admin)
export const deliverOrder = createAsyncThunk('order/deliver', async (order, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo }
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Get My Orders
export const listMyOrders = createAsyncThunk('order/listMy', async (_, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo }
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/orders/myorders`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

// Get All Orders (Admin)
export const listOrders = createAsyncThunk('order/list', async (_, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo }
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/orders`, config);
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        loading: false,
        error: null,
        success: false,
        order: null,
        orders: [],
        myOrders: []
    },
    reducers: {
        orderCreateReset: (state) => {
            state.success = false;
        },
        orderPayReset: (state) => {
            state.successPay = false; // Note: You might want separate success flags
        },
        orderDeliverReset: (state) => {
            state.successDeliver = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Order Details
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Pay Order
            .addCase(payOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(payOrder.fulfilled, (state) => {
                state.loading = false;
                state.successPay = true;
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Deliver Order
            .addCase(deliverOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(deliverOrder.fulfilled, (state) => {
                state.loading = false;
                state.successDeliver = true;
            })
            .addCase(deliverOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // List My Orders
            .addCase(listMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(listMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.myOrders = action.payload;
            })
            .addCase(listMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // List All Orders
            .addCase(listOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(listOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(listOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { orderCreateReset, orderPayReset, orderDeliverReset } = orderSlice.actions;

export default orderSlice.reducer;
