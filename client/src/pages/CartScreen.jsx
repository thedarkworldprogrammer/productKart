import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="bg-blue-100 p-4 rounded text-blue-700">
                        Your cart is empty <Link to="/" className="font-bold underline">Go Back</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <Link to={`/product/${item.product}`} className="font-medium hover:text-blue-600">
                                        {item.name}
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold">${item.price}</span>
                                    <select
                                        className="border rounded p-1"
                                        value={item.qty}
                                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeFromCartHandler(item.product)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="md:col-span-1">
                <div className="border rounded shadow-sm p-4">
                    <h2 className="text-xl font-bold mb-4">
                        Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                    </h2>
                    <div className="text-2xl font-bold mb-4">
                        ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </div>
                    <button
                        type="button"
                        className={`w-full py-2 px-4 rounded font-bold text-white ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
                            }`}
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                    >
                        Proceed To Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;
