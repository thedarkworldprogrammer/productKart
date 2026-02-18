import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, deliverOrder, orderDeliverReset } from '../slices/orderSlice';
import { toast } from 'react-toastify';

const OrderScreen = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.order);
    const { order, loading, error, successDeliver } = orderDetails;

    const userLogin = useSelector((state) => state.user);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!order || order._id !== id || successDeliver) {
            dispatch(orderDeliverReset());
            dispatch(getOrderDetails(id));
        }
    }, [order, id, successDeliver, dispatch]);

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    };

    return loading ? (
        <div>Loading...</div>
    ) : error ? (
        <div className="text-red-500">{error}</div>
    ) : (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">Order {order._id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-xl font-bold mb-4">Shipping</h2>
                        <p>
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email: </strong>
                            <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:text-blue-800">{order.user.email}</a>
                        </p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="bg-green-100 text-green-700 p-2 rounded mt-2">Delivered on {order.deliveredAt.substring(0, 10)}</div>
                        ) : (
                            <div className="bg-red-100 text-red-700 p-2 rounded mt-2">Not Delivered</div>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <div className="bg-green-100 text-green-700 p-2 rounded mt-2">Paid on {order.paidAt.substring(0, 10)}</div>
                        ) : (
                            <div className="bg-red-100 text-red-700 p-2 rounded mt-2">Not Paid</div>
                        )}
                    </div>

                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <div className="text-red-500">Order is empty</div>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
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
                                <span>${order.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${order.taxPrice}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${order.totalPrice}</span>
                            </div>
                        </div>
                        {loading && <div>Loading...</div>}
                        {userInfo && userInfo.isAdmin && !order.isDelivered && (
                            <button
                                type="button"
                                className="w-full py-2 px-4 rounded font-bold text-white bg-blue-600 hover:bg-blue-700"
                                onClick={deliverHandler}
                            >
                                Mark As Delivered
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;
