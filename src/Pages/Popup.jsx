import React, { useState, useEffect } from 'react';
import "../Css/Popup.css"

const Popup = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div className={`popup ${visible ? 'show' : ''}`}>
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
