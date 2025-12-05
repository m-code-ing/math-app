import React from 'react';
import './VisualBlocks.css';

interface VisualBlocksProps {
  tens: number;
  units: number;
  isClickable?: boolean;
  onTensClick?: () => void;
  onUnitsClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const VisualBlocks: React.FC<VisualBlocksProps> = ({
  tens,
  units,
  isClickable = false,
  onTensClick,
  onUnitsClick,
  size = 'medium'
}) => {
  const handleTensClick = () => {
    if (isClickable && onTensClick && tens > 0) {
      onTensClick();
    }
  };

  const handleUnitsClick = () => {
    if (isClickable && onUnitsClick && units > 0) {
      onUnitsClick();
    }
  };

  return (
    <div className={`visual-blocks ${size}`}>
      {tens > 0 && (
        <div className="tens-section">
          <div className="section-label">Tens</div>
          <div 
            className={`tens-container ${isClickable ? 'clickable' : ''}`}
            onClick={handleTensClick}
          >
            {Array.from({ length: tens }, (_, i) => (
              <div key={`ten-${i}`} className="ten-block">
                <div className="ten-grid">
                  {Array.from({ length: 10 }, (_, j) => (
                    <div key={`unit-${j}`} className="grid-unit"></div>
                  ))}
                </div>
                <div className="ten-label">10</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {units > 0 && (
        <div className="units-section">
          <div className="section-label">Units</div>
          <div 
            className={`units-container ${isClickable ? 'clickable' : ''}`}
            onClick={handleUnitsClick}
          >
            {Array.from({ length: units }, (_, i) => (
              <div key={`unit-${i}`} className="unit-block"></div>
            ))}
          </div>
        </div>
      )}

      {tens === 0 && units === 0 && (
        <div className="empty-state">
          <p>No tens or units to show</p>
        </div>
      )}
    </div>
  );
};

export default VisualBlocks;