import React, { useState } from 'react';
import { NumberBreakdown } from '../types/MathProblem';
import './NumberDecomposition.css';

interface NumberDecompositionProps {
  number: number;
  onComplete: (breakdown: NumberBreakdown) => void;
}

const NumberDecomposition: React.FC<NumberDecompositionProps> = ({ number, onComplete }) => {
  const [tens, setTens] = useState<number>(0);
  const [units, setUnits] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);

  const maxTens = Math.floor(number / 10);
  const maxUnits = 9;

  const handleTensChange = (value: number) => {
    setTens(value);
    setShowError(false);
    // Auto-calculate remaining units when tens change
    const remainingValue = number - (value * 10);
    if (remainingValue >= 0 && remainingValue <= 9) {
      setUnits(remainingValue);
    }
  };

  const handleUnitsChange = (value: number) => {
    setUnits(value);
    setShowError(false);
  };

  const validateAndSubmit = () => {
    const totalValue = (tens * 10) + units;
    
    if (totalValue === number) {
      const breakdown: NumberBreakdown = {
        value: number,
        tens,
        units
      };
      onComplete(breakdown);
    } else {
      setShowError(true);
    }
  };

  const isCorrect = (tens * 10) + units === number;

  return (
    <div className="number-decomposition">
      <div className="decomposition-display">
        <div className="equation">
          <span className="number">{number}</span>
          <span className="equals">=</span>
          <div className="breakdown-inputs">
            <div className="tens-section">
              <NumberSelector
                value={tens}
                onChange={handleTensChange}
                max={maxTens}
                label="tens"
              />
              <span className="plus">+</span>
            </div>
            <div className="units-section">
              <NumberSelector
                value={units}
                onChange={handleUnitsChange}
                max={maxUnits}
                label="units"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="visual-representation">
        <VisualBlocks tens={tens} units={units} />
      </div>

      <div className="validation-feedback">
        {isCorrect ? (
          <div className="success-message">
            ✓ Correct! {tens} tens + {units} units = {number}
          </div>
        ) : showError ? (
          <div className="error-message">
            ✗ Not quite right. {tens} tens + {units} units = {(tens * 10) + units}, but we need {number}
          </div>
        ) : (
          <div className="instruction">
            Choose how many tens and units make {number}
          </div>
        )}
      </div>

      <button
        className={`submit-button ${isCorrect ? 'ready' : 'disabled'}`}
        onClick={validateAndSubmit}
        disabled={!isCorrect}
      >
        {isCorrect ? 'Continue →' : 'Keep trying...'}
      </button>
    </div>
  );
};

interface NumberSelectorProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  label: string;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({ value, onChange, max, label }) => {
  return (
    <div className="number-selector">
      <div className="selector-buttons">
        {Array.from({ length: max + 1 }, (_, i) => i).map((num) => (
          <button
            key={num}
            className={`selector-button ${value === num ? 'selected' : ''}`}
            onClick={() => onChange(num)}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="selector-label">{label}</div>
    </div>
  );
};

interface VisualBlocksProps {
  tens: number;
  units: number;
}

const VisualBlocks: React.FC<VisualBlocksProps> = ({ tens, units }) => {
  return (
    <div className="visual-blocks">
      <div className="tens-blocks">
        {Array.from({ length: tens }, (_, i) => (
          <div key={`ten-${i}`} className="ten-block">
            <div className="ten-block-grid">
              {Array.from({ length: 10 }, (_, j) => (
                <div key={`unit-${j}`} className="unit-square"></div>
              ))}
            </div>
            <div className="ten-label">10</div>
          </div>
        ))}
      </div>
      <div className="units-blocks">
        {Array.from({ length: units }, (_, i) => (
          <div key={`unit-${i}`} className="unit-block"></div>
        ))}
      </div>
    </div>
  );
};

export default NumberDecomposition;