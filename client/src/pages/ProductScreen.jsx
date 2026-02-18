import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { listProductDetails } from '../slices/productSlice';

const ProductScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector((state) => state.user);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch(listProductDetails(id));
    }, [dispatch, id]);

    const addToCartHandler = () => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty
        }));
        navigate('/cart');
    };

    return (
        <div>
            <Link className="btn btn-light my-3" to="/">
                Go Back
            </Link>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-1">
                        <img src={product.image} alt={product.name} className="w-full h-auto object-contain" />
                    </div>
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="text-2xl font-semibold">{product.name}</h3>
                        <div className="border-b pb-2">
                            <span className="flex items-center text-yellow-500 font-bold">
                                {product.rating} ★
                            </span>
                            <span className="text-gray-600 text-sm">{product.numReviews} reviews</span>
                        </div>
                        <div className="text-3xl font-bold">Price: ${product.price}</div>
                        <p className="text-gray-700">{product.description}</p>

                        {/* Hide Add to Cart for Admin */}
                        {!(userInfo && userInfo.isAdmin) && (
                            <div className="border p-4 rounded shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span>Status:</span>
                                    <span className={product.countInStock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                {product.countInStock > 0 && (
                                    <div className="flex justify-between items-center mb-4">
                                        <span>Qty</span>
                                        <select
                                            className="border rounded p-1"
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button
                                    className={`w-full py-2 px-4 rounded font-bold text-white ${product.countInStock > 0 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                >
                                    {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductScreen;
