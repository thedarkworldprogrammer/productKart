import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/userSlice';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { search } = useLocation();

    const redirect = new URLSearchParams(search).get('redirect') || '/';

    const { userInfo, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-6">Sign In</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {loading && <div>Loading...</div>}
            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Email Address</label>
                    <input
                        type="email"
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Sign In
                </button>
            </form>

            <div className="mt-4">
                New Customer?{' '}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-blue-600 hover:underline">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default LoginScreen;
