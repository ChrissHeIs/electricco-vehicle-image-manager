import React, { useState, useEffect, useRef } from 'react';

interface ZoomOverlayImageProps {
    imageURL: string;
    onClose: () => void;
}

const ZoomOverlayImage: React.FC<ZoomOverlayImageProps> = ({ imageURL, onClose }) => {
    return (
        <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <img
            src={imageURL || ''}
            alt="Zoomed Image"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              padding: '5px 10px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            X
          </button>
        </div>
      </div>
    )
}

export default ZoomOverlayImage