import React, { useState } from 'react';
import './MultipleChoiceAnswer.css';

interface MultipleChoiceAnswerProps {
  choices: number[];
  correctAnswer: number;
  onSelect: (selectedAnswer: number) => void;
}

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({
  choices,
  correctAnswer,
  onSelect
}) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [hasSelected, setHasSelected] = useState(false);

  const handleChoiceClick = (choice: number) => {
    if (hasSelected) return; // Prevent multiple selections

    setSelectedChoice(choice);
    setHasSelected(true);
    
    // Add a small delay to show the selection before calling onSelect
    setTimeout(() => {
      onSelect(choice);
    }, 500);
  };

  const getChoiceClassName = (choice: number) => {
    let className = 'choice-button';
    
    if (selectedChoice === choice) {
      className += choice === correctAnswer ? ' correct' : ' incorrect';
    }
    
    if (hasSelected && choice !== selectedChoice) {
      className += ' disabled';
    }
    
    return className;
  };

  return (
    <div className="multiple-choice-answer">
      <div className="choices-container">
        {choices.map((choice, index) => (
          <button
            key={`choice-${choice}-${index}`}
            className={getChoiceClassName(choice)}
            onClick={() => handleChoiceClick(choice)}
            disabled={hasSelected}
            aria-label={`Answer choice ${choice}`}
          >
            <span className="choice-number">{choice}</span>
            {selectedChoice === choice && (
              <div className="selection-indicator">
                {choice === correctAnswer ? '✓' : '✗'}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {hasSelected && (
        <div className="feedback-message">
          {selectedChoice === correctAnswer ? (
            <div className="success-feedback">
              🎉 Excellent! You got it right!
            </div>
          ) : (
            <div className="try-again-feedback">
              😊 Good try! The correct answer is {correctAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceAnswer;