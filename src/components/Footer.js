import React from 'react';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`footer mt-5 py-4 ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <hr className={`mb-4 ${darkMode ? 'dark-hr' : ''}`} />
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

