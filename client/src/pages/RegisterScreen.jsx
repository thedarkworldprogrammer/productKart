import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../slices/userSlice';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

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
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            dispatch(register({ name, email, password }));
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-6">Sign Up</h1>
            {message && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {loading && <div>Loading...</div>}
            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Email Address</label>
                    <input
                        type="email"
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded focus:outline-blue-500"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Register
                </button>
            </form>

            <div className="mt-4">
                Have an Account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-blue-600 hover:underline">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default RegisterScreen;
