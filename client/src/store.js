import { configureStore } from '@reduxjs/toolkit';
import {
    productListReducer,
    productDetailsReducer,
    productDeleteReducer,
    productCreateReducer,
    productUpdateReducer,
} from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
    reducer: {
        productList: productListReducer,
        productDetails: productDetailsReducer,
        productDelete: productDeleteReducer,
        productCreate: productCreateReducer,
        productUpdate: productUpdateReducer,
        cart: cartReducer,
        user: userReducer,
        order: orderReducer,
    },
});

export default store;
