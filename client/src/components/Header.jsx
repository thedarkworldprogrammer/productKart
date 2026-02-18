import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../slices/userSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    const { userInfo } = user;

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="bg-green-200 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold italic tracking-wide group">
                    ProductKart
                    <span className="text-yellow-400 text-sm not-italic ml-1 group-hover:text-yellow-300 transition">power</span>
                </Link>

                <div className="flex-grow mx-4 md:mx-12 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        className="w-full px-4 py-2 rounded-sm text-gray-800 focus:outline-none shadow-sm"
                    />
                </div>

                <nav className="flex items-center space-x-6 font-medium">
                    {userInfo ? (
                        <div className="relative group cursor-pointer flex items-center gap-1">
                            <FaUser />
                            <span>{userInfo.name.split(' ')[0]}</span>
                            <div className="absolute right-0 top-full pt-2 hidden group-hover:block min-w-[150px]">
                                <div className="bg-white text-gray-800 shadow-lg rounded overflow-hidden">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                    <button
                                        onClick={logoutHandler}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <FaSignOutAlt className="text-sm" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-white text-blue-600 px-6 py-1 rounded-sm font-semibold hover:bg-gray-100 transition">
                            Login
                        </Link>
                    )}

                    {userInfo && userInfo.isAdmin && (
                        <div className="relative group cursor-pointer flex items-center gap-1">
                            <span>Admin</span>
                            <div className="absolute right-0 top-full pt-2 hidden group-hover:block min-w-[150px]">
                                <div className="bg-white text-gray-800 shadow-lg rounded overflow-hidden">
                                    <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">Products</Link>
                                    <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                                    <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100">Users</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {!(userInfo && userInfo.isAdmin) && (
                        <Link to="/cart" className="flex items-center hover:text-gray-200 relative">
                            <FaShoppingCart className="mr-1 text-xl" />
                            <span>Cart</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
