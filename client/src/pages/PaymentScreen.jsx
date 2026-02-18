import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="container mx-auto mt-10 max-w-lg">
            <h1 className="text-3xl font-bold mb-6">Payment Method</h1>
            <form onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Method</label>
                    <div className="mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="paymentMethod"
                                value="CashOnDelivery"
                                checked={paymentMethod === 'CashOnDelivery'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="ml-2">Cash On Delivery (COD)</span>
                        </label>
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Continue
                </button>
            </form>
        </div>
    );
};

export default PaymentScreen;
