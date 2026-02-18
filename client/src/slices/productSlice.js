import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all products
export const listProducts = createAsyncThunk('products/list', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/products');
        return data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Fetch single product
export const listProductDetails = createAsyncThunk('products/details', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/products/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Delete product
export const deleteProduct = createAsyncThunk('products/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/products/${id}`, config);
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Create product
export const createProduct = createAsyncThunk('products/create', async (_, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`/api/products`, {}, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

// Update product
export const updateProduct = createAsyncThunk('products/update', async (product, { getState, rejectWithValue }) => {
    try {
        const {
            user: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/products/${product._id}`, product, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

const productListSlice = createSlice({
    name: 'productList',
    initialState: { products: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listProducts.pending, (state) => {
                state.loading = true;
                state.products = [];
            })
            .addCase(listProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(listProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const productDetailsSlice = createSlice({
    name: 'productDetails',
    initialState: { product: { reviews: [] }, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listProductDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(listProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(listProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const productDeleteSlice = createSlice({
    name: 'productDelete',
    initialState: { loading: false, error: null, success: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const productCreateSlice = createSlice({
    name: 'productCreate',
    initialState: { loading: false, error: null, success: false, product: null },
    reducers: {
        productCreateReset: (state) => {
            state.success = false;
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.product = action.payload;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

const productUpdateSlice = createSlice({
    name: 'productUpdate',
    initialState: { loading: false, error: null, success: false, product: null },
    reducers: {
        productUpdateReset: (state) => {
            state.success = false;
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.product = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { productCreateReset } = productCreateSlice.actions;
export const { productUpdateReset } = productUpdateSlice.actions;

export const productListReducer = productListSlice.reducer;
export const productDetailsReducer = productDetailsSlice.reducer;
export const productDeleteReducer = productDeleteSlice.reducer;
export const productCreateReducer = productCreateSlice.reducer;
export const productUpdateReducer = productUpdateSlice.reducer;
