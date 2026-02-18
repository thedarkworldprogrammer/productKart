import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts } from '../slices/productSlice';

const HomeScreen = () => {
    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Latest Products</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <Link to={`/product/${product._id}`}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-contain p-4"
                                />
                            </Link>
                            <div className="p-4">
                                <Link to={`/product/${product._id}`}>
                                    <h2 className="text-sm font-medium text-gray-800 hover:text-blue-600 truncate">
                                        {product.name}
                                    </h2>
                                </Link>

                                <div className="mt-2 flex items-center">
                                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                                        {product.rating} ★
                                    </span>
                                    <span className="text-gray-500 text-xs ml-2">({product.numReviews})</span>
                                </div>

                                <div className="mt-3 font-bold text-lg">
                                    ${product.price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
