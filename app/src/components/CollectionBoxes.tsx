import React from 'react';
import './CollectionBoxes.css';

interface CollectionBoxesProps {
  tensCount: number;
  unitsCount: number;
}

const CollectionBoxes: React.FC<CollectionBoxesProps> = ({
  tensCount,
  unitsCount
}) => {
  return (
    <div className="collection-boxes">
      <div className="collection-box tens-box">
        <div className="collected-items">
          {Array.from({ length: tensCount }, (_, i) => (
            <div key={`collected-ten-${i}`} className="collected-ten">
              <div className="ten-grid-small">
                {Array.from({ length: 10 }, (_, j) => (
                  <div key={`unit-${j}`} className="grid-unit-small"></div>
                ))}
              </div>
              <span className="ten-value">10</span>
            </div>
          ))}
        </div>
      </div>

      <div className="collection-box units-box">
        <div className="collected-items">
          {Array.from({ length: unitsCount }, (_, i) => (
            <div key={`collected-unit-${i}`} className="collected-unit">
              <div className="unit-circle">{1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionBoxes;