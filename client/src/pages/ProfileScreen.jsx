import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetails, updateUserProfile } from '../slices/userSlice';
import { listMyOrders } from '../slices/orderSlice';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    const { loading, error, userInfo } = user;

    const orderListMy = useSelector((state) => state.order);
    const { loading: loadingOrders, error: errorOrders, myOrders } = orderListMy;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            if (!user.name || user.name !== userInfo.name) {
                setName(userInfo.name);
                setEmail(userInfo.email);
            }
            dispatch(listMyOrders());
        }
    }, [navigate, userInfo, dispatch, user.name]);

    const submitHandler = async (e) => {
        // ... (keep existing submit logic)
        e.preventDefault();
        setMessage(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        const updates = {};
        const successParts = [];

        if (name !== userInfo.name) {
            updates.name = name;
            successParts.push('Name');
        }
        if (email !== userInfo.email) {
            updates.email = email;
            successParts.push('Email');
        }
        if (password) {
            updates.password = password;
            successParts.push('Password');
        }

        if (Object.keys(updates).length === 0) {
            setMessage('No changes made');
            return;
        }

        try {
            await dispatch(updateUserProfile({ id: userInfo._id, ...updates })).unwrap();
            setSuccessMessage(`${successParts.join(', ')} updated successfully`);
            setIsEditing(false);
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            // Error is handled by Redux state
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            // Reset fields when entering edit mode
            setName(userInfo.name);
            setEmail(userInfo.email);
        } else {
            setMessage(null);
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h2 className="text-2xl font-bold mb-6">User Profile</h2>
                    {message && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{message}</div>}
                    {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{successMessage}</div>}
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
                    {loading && <div className="text-center">Loading...</div>}

                    {!isEditing ? (
                        <div className="bg-white p-6 rounded shadow-md">
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-semibold">Name:</span>
                                    <span className="text-lg text-gray-800">{userInfo?.name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-semibold">Email:</span>
                                    <span className="text-lg text-gray-800">{userInfo?.email}</span>
                                </div>
                                <button
                                    onClick={toggleEdit}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-6"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submitHandler} className="bg-white p-6 rounded shadow-md">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">Update</button>
                                <button type="button" onClick={toggleEdit} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full">Cancel</button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="md:col-span-3">
                    <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                    {loadingOrders ? (
                        <div>Loading...</div>
                    ) : errorOrders ? (
                        <div className="text-red-500">{errorOrders}</div>
                    ) : (
                        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DATE</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TOTAL</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PAID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DELIVERED</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order._id}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.createdAt.substring(0, 10)}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${order.totalPrice}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {order.isPaid ? (
                                                    <span className="text-green-600">{order.paidAt.substring(0, 10)}</span>
                                                ) : (
                                                    <span className="text-red-600">Not Paid</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {order.isDelivered ? (
                                                    <span className="text-green-600">{order.deliveredAt.substring(0, 10)}</span>
                                                ) : (
                                                    <span className="text-red-600">Not Delivered</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <Link to={`/order/${order._id}`} className="text-blue-600 hover:text-blue-900 font-bold">Details</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
