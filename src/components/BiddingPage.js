import React, { useState } from 'react';
import './Bidding.css';

const BiddingPage = ({ darkMode }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    startingBid: '',
    currentBid: '',
    endTime: '',
  });
  const [bidAmount, setBidAmount] = useState('');
  const [bidConfirmation, setBidConfirmation] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    const { startingBid, currentBid, name, description, endTime } = newProduct;

    // Validate that all required fields are filled
    if (!name || !description || !startingBid || !currentBid || !endTime) {
      alert('Please fill all the required bid details first.');
      return;
    }

    // Convert currentBid and startingBid to numbers
    const numericStartingBid = parseInt(startingBid);
    const numericCurrentBid = parseInt(currentBid);

    // Check if the current bid is less than the starting bid
    if (numericCurrentBid < numericStartingBid) {
      alert('Current bid must be greater than or equal to the starting bid');
      return;
    }

    // Add the new product to the products array
    setProducts([...products, { ...newProduct }]);

    // Clear the form after adding the product
    setNewProduct({
      name: '',
      description: '',
      startingBid: '',
      currentBid: '',
      endTime: '',
    });
  };

  const handlePlaceBid = (productIndex) => {
    const product = products[productIndex];

    if (!bidAmount) {
      alert('Please enter a bid amount.');
      return;
    }

    const numericBidAmount = parseInt(bidAmount);

    if (numericBidAmount <= product.currentBid) {
      alert(`Bid amount must be greater than the current bid of ${product.currentBid}`);
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((prevProduct, index) =>
        index === productIndex ? { ...prevProduct, currentBid: numericBidAmount } : prevProduct
      )
    );

    setBidConfirmation('Thank you for placing the bid!');
    setBidAmount('');
  };

  return (
    <div className={`bidding-page ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Add Product for Auction</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={newProduct.name || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" name="description" value={newProduct.description || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Starting Bid:</label>
        <input type="number" name="startingBid" value={newProduct.startingBid || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Current Bid:</label>
        <input type="number" name="currentBid" value={newProduct.currentBid} onChange={handleInputChange} />
      </div>
      <div>
        <label>End Time:</label>
        <input type="datetime-local" name="endTime" value={newProduct.endTime || ''} onChange={handleInputChange} />
      </div>

      <button onClick={handleAddProduct}>Add Product</button>

      <h3>Products you have added :</h3>
      {products.map((product, index) => (
        <div key={index} className="product">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Starting Bid: ${product.startingBid}</p>
          <p>Current Bid: ${product.currentBid}</p>
          <div>
            <label>Place Bid:</label>
            <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
            <button onClick={() => handlePlaceBid(index)}>Place Bid</button>
          </div>
        </div>
      ))}

      {bidConfirmation && <p className="confirmation-message">{bidConfirmation}</p>}
    </div>
  );
};

export default BiddingPage;
