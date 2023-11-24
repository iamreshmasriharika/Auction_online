import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Product.css';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductsPage = ({ darkMode, email }) => {
  const [products, setProducts] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [winningUsers, setWinningUsers] = useState({});
  const [bidConfirmation, setBidConfirmation] = useState('');
  const navigate = useNavigate();

  // Use the userId from the context
  const auth = useAuth();
  const userId = auth.userId;

  // Fetch winning user details
  const fetchWinningUser = async (productId) => {
    try {
      const winningUserResponse = await axios.get(
        `https://backend-online-auction-system-mern.onrender.com/api/getWinningBid/${productId}`
      );
      setWinningUsers((prevWinningUsers) => ({
        ...prevWinningUsers,
        [productId]: winningUserResponse.data.winningBid.userId,
      }));
    } catch (error) {
      console.error('Error fetching winning user details:', error);
    }
  };

  useEffect(() => {
    // Fetch static list of products available for bidding
    const staticProducts = [
      {
        _id: '1',
        name: 'Product 1',
        description: 'Description for Product 1',
        userId: 'User1',
        startingBid: 100,
        currentBid: 100,
        endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      },
      {
        _id: '2',
        name: 'Product 2',
        description: 'Description for Product 1',
        userId: 'User2',
        startingBid: 100,
        currentBid: 1000,
        endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      },
      {
        _id: '3',
        name: 'Product 3',
        description: 'Description for Product 1',
        userId: 'User3',
        startingBid: 100,
        currentBid: 1005,
        endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      },
      // Add more static products as needed
    ];

    setProducts(staticProducts);

    // Call fetchWinningUser for each static product
    staticProducts.forEach((product) => fetchWinningUser(product._id));
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to format date in "dd//mm/yyyy" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateRemainingTime = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const timeDiff = end - now;

    if (timeDiff <= 0) {
      return {
        ended: true,
        message: 'Bid has ended',
      };
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    const endDateFormatted = formatDate(endTime);

    return {
      ended: false,
      message: `Bid ends on: ${endDateFormatted}, ${hours}h ${minutes}m ${seconds}s left`,
    };
  };

  const handleBid = async (productId, currentBid, startingBid) => {
    setShowBidModal(true);
    setSelectedProduct({ productId, currentBid, startingBid });
  };

  const placeBid = async () => {
    console.log('Selected Product:', selectedProduct);
    console.log('Bid Amount:', bidAmount);

    if (!selectedProduct) {
      alert('Invalid product');
      return;
    }

    const product = products.find((p) => p._id === selectedProduct.productId);

    if (!product) {
      alert('Product not found in the list');
      return;
    }

    const startingBid = Number(product.startingBid);

    if (Number(bidAmount) <= startingBid) {
      alert(`Bid amount must be greater than the starting bid of ${startingBid}`);
      return;
    }

    // Simulate placing a bid
    const updatedProducts = products.map((p) =>
      p._id === selectedProduct.productId ? { ...p, currentBid: Number(bidAmount) } : p
    );

    // Fetch winning user details after placing a bid
    await fetchWinningUser(selectedProduct.productId);

    // Update the state with the new product information
    setProducts(updatedProducts);

    setShowBidModal(false);
    setBidAmount(''); // Clear bidAmount after a successful bid

    // Display thank you message
    setBidConfirmation('Thanks for your bid! Please wait for the results.');
  };

  const closeModal = () => {
    setShowBidModal(false);
    setSelectedProduct(null);
    setBidAmount('');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Filter products based on search criteria
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.startingBid.toString().includes(searchTerm) ||
        product.currentBid.toString().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`products-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container mt-5">
        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search by product name or bid : "
            className="form-control"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="row">
          {/* Display filtered products instead of all products */}
          {filteredProducts.map((product, index) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-text">Product Name : {product.name}</h5>
                  <p className="card-text">Product Description : {product.description}</p>
                  <p className="card-text">Product added by: {product.userId ? product.userId : 'Unknown'}</p>
                  <p className="card-text">Starting Bid: &#8377;{product.startingBid}</p>
                  <p className="card-text">Current Bid: &#8377;{product.currentBid}</p>

                  <p className="card-text">
                    {product.endTime &&
                      (() => {
                        const remainingTime = calculateRemainingTime(product.endTime);
                        if (remainingTime.ended) {
                          return `Bid has ended`;
                        } else {
                          return `Bid ends on: ${remainingTime.message}`;
                        }
                      })()}
                  </p>
                  {/* Display the highest bid and winning user after the bid has ended */}
                  {product.endTime && new Date(product.endTime) < new Date() && (
                    <>
                      <p className="card-text">Highest Bid: &#8377;{product.currentBid}</p>
                      <p className="card-text">Bid Won By: {winningUsers[product._id] ? winningUsers[product._id] : 'No Winner'}</p>
                    </>
                  )}
                  <button className="btn btn-primary" onClick={() => handleBid(product._id, product.currentBid, product.startingBid)}>
                    Place Bid
                  </button>{' '}
                  &nbsp;
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBidModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Place Bid</h2>
                <button type="button" className="close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>Current Bid: &#8377;{selectedProduct.currentBid}</p>
                <input
                  type="number"
                  placeholder="Enter your bid amount"
                  className="form-control"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={placeBid}>
                  Place Bid
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bidConfirmation && (
        <div className="alert alert-success mt-3" role="alert">
          {bidConfirmation}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
