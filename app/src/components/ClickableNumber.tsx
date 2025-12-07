import React from 'react';
import './ClickableNumber.css';

interface ClickableNumberProps {
  number: number;
  isSelectable: boolean;
  isDecomposed: boolean;
  onClick: () => void;
}

const ClickableNumber: React.FC<ClickableNumberProps> = ({
  number,
  isSelectable,
  isDecomposed,
  onClick
}) => {
  const handleClick = () => {
    if (isSelectable) {
      onClick();
    }
  };

  const getClassName = () => {
    let className = 'clickable-number';
    
    if (!isSelectable) {
      className += ' disabled';
    }
    
    if (isDecomposed) {
      className += ' decomposed';
    }
    
    if (isSelectable && !isDecomposed) {
      className += ' selectable';
    }
    
    return className;
  };

  return (
    <button
      className={getClassName()}
      onClick={handleClick}
      disabled={!isSelectable}
      aria-label={`Number ${number}${isSelectable ? ', click to break down' : ', already used'}`}
    >
      <span className="number-value">{number}</span>
      {isDecomposed && (
        <div className="checkmark">✓</div>
      )}
    </button>
  );
};

export default ClickableNumber;