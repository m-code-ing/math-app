import React, { useState, useEffect } from 'react';
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
  const [incorrectChoices, setIncorrectChoices] = useState<Set<number>>(new Set());
  const [correctChoiceSelected, setCorrectChoiceSelected] = useState(false);
  const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
      }
    };
  }, [feedbackTimeout]);

  const handleChoiceClick = (choice: number) => {
    // Don't allow clicking on already marked incorrect choices or if correct answer already selected
    if (incorrectChoices.has(choice) || correctChoiceSelected) {
      return;
    }
    
    setSelectedChoice(choice);
    
    if (choice === correctAnswer) {
      // Permanently mark correct answer as selected
      setCorrectChoiceSelected(true);
    } else {
      // If this is an incorrect answer, permanently mark it as incorrect
      setIncorrectChoices(prev => new Set(prev).add(choice));
    }
    
    // Clear any existing timeout
    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout);
    }
    
    // Show feedback briefly, then clear selection (but keep locked states)
    const timeout = setTimeout(() => {
      setSelectedChoice(null);
      setFeedbackTimeout(null);
    }, 1500);
    
    setFeedbackTimeout(timeout);
    onSelect(choice);
  };

  const getChoiceClassName = (choice: number) => {
    let className = 'choice-button';
    
    // If this choice is permanently marked as incorrect
    if (incorrectChoices.has(choice)) {
      className += ' incorrect locked';
    }
    // If this is the correct answer and it's been selected
    else if (choice === correctAnswer && correctChoiceSelected) {
      className += ' correct locked';
    }
    // If this choice is currently selected (for temporary feedback)
    else if (selectedChoice === choice) {
      className += choice === correctAnswer ? ' correct' : ' incorrect';
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
            disabled={incorrectChoices.has(choice) || correctChoiceSelected}
            aria-label={`Answer choice ${choice}`}
          >
            <span className="choice-number">{choice}</span>
            {(selectedChoice === choice || incorrectChoices.has(choice) || (choice === correctAnswer && correctChoiceSelected)) && (
              <div className="selection-indicator">
                {choice === correctAnswer ? '✓' : '✗'}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {selectedChoice && (
        <div className="feedback-message">
          {selectedChoice === correctAnswer ? (
            <div className="success-feedback">
              ✓ Correct!
            </div>
          ) : (
            <div className="try-again-feedback">
              ✗ Try again
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceAnswer;