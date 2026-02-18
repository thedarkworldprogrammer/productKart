import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Correcting to Tailwind CSS
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrder, orderCreateReset } from '../slices/orderSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 100);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    const orderCreate = useSelector((state) => state.order);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`);
            dispatch(orderCreateReset());
            dispatch(clearCartItems());
        }
        // eslint-disable-next-line
    }, [navigate, success]);

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
            })
        );
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">Place Order</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-xl font-bold mb-4">Shipping</h2>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </div>

                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <div className="text-red-500">Your cart is empty</div>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center space-x-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                            <Link to={`/product/${item.product}`} className="font-medium hover:text-blue-600">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-700">
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 border-b pb-4 mb-4">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>${itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${taxPrice}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <button
                            type="button"
                            className={`w-full py-2 px-4 rounded font-bold text-white ${cart.cartItems === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
                                }`}
                            disabled={cart.cartItems === 0}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
