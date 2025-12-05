import React from 'react';
import Modal from './Modal';
import './DecompositionModal.css';

interface DecompositionModalProps {
  isOpen: boolean;
  number: number;
  onPieceClick: (type: 'tens' | 'units', amount: number) => void;
  onClose: () => void;
  clickedPieces: {
    tensClicked: boolean;
    unitsClicked: boolean;
  };
}

const DecompositionModal: React.FC<DecompositionModalProps> = ({
  isOpen,
  number,
  onPieceClick,
  onClose,
  clickedPieces
}) => {
  const tens = Math.floor(number / 10);
  const units = number % 10;

  const handleTensClick = () => {
    if (!clickedPieces.tensClicked) {
      onPieceClick('tens', tens);
    }
  };

  const handleUnitsClick = () => {
    if (!clickedPieces.unitsClicked) {
      onPieceClick('units', units);
    }
  };

  const allPiecesClicked = clickedPieces.tensClicked && clickedPieces.unitsClicked;
  const canContinue = allPiecesClicked || (tens === 0 && clickedPieces.unitsClicked) || (units === 0 && clickedPieces.tensClicked);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`${number} = ?`}
      className="decomposition-modal"
    >
      <div className="decomposition-content">
        <div className="breakdown-equation">
          <button 
            className={`piece-button tens-piece ${clickedPieces.tensClicked ? 'clicked' : ''}`}
            onClick={handleTensClick}
            disabled={tens === 0 || clickedPieces.tensClicked}
          >
            {tens * 10}
            {clickedPieces.tensClicked && <div className="piece-checkmark">✓</div>}
          </button>
          
          <span className="plus">+</span>
          
          <button 
            className={`piece-button units-piece ${clickedPieces.unitsClicked ? 'clicked' : ''}`}
            onClick={handleUnitsClick}
            disabled={units === 0 || clickedPieces.unitsClicked}
          >
            {units}
            {clickedPieces.unitsClicked && <div className="piece-checkmark">✓</div>}
          </button>
        </div>

        {canContinue && (
          <div className="continue-section">
            <button className="continue-button" onClick={onClose}>
              Continue →
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DecompositionModal;