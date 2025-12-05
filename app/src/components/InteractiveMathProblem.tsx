import React, { useState, Fragment } from 'react';
import { InteractiveState, MathProblem } from '../types/InteractiveMath';
import ClickableNumber from './ClickableNumber';
import MultipleChoiceAnswer from './MultipleChoiceAnswer';
import './InteractiveMathProblem.css';

interface InteractiveMathProblemProps {
  problem: MathProblem;
  onComplete: (correct: boolean, interactions: number) => void;
}

const InteractiveMathProblem: React.FC<InteractiveMathProblemProps> = ({ 
  problem, 
  onComplete 
}) => {
  const [state, setState] = useState<InteractiveState>({
    currentPhase: 'number1',
    currentNumber: null,
    number1: { 
      value: problem.num1, 
      isDecomposed: false, 
      isSelectable: true,
      tens: 0,
      units: 0
    },
    number2: { 
      value: problem.num2, 
      isDecomposed: false, 
      isSelectable: false,
      tens: 0,
      units: 0
    },
    collectedPieces: [],
    splitClickedPieces: {
      tensClicked: false,
      unitsClicked: false,
    },
    showFinalChoices: false,
    selectedAnswer: null,
    isCorrect: null,
  });

  const [interactionCount, setInteractionCount] = useState(0);

  const handleNumberClick = (number: number) => {
    setInteractionCount(prev => prev + 1);
    setState(prev => ({
      ...prev,
      currentNumber: number,
      splitClickedPieces: {
        tensClicked: false,
        unitsClicked: false,
      }
    }));
  };

  const handlePieceClick = (type: 'tens' | 'units', amount: number) => {
    setInteractionCount(prev => prev + 1);
    
    setState(prev => {
      const newClickedPieces = {
        tensClicked: type === 'tens' ? true : prev.splitClickedPieces.tensClicked,
        unitsClicked: type === 'units' ? true : prev.splitClickedPieces.unitsClicked,
      };

      const pieceValue = type === 'tens' ? amount * 10 : amount;
      const newCollectedPieces = [...prev.collectedPieces, pieceValue];
      
      const numberData = {
        number: prev.currentNumber!,
        tens: Math.floor(prev.currentNumber! / 10),
        units: prev.currentNumber! % 10
      };
      
      const shouldAutoContinue = 
        (numberData.tens === 0 && newClickedPieces.unitsClicked) ||
        (numberData.units === 0 && newClickedPieces.tensClicked) ||
        (newClickedPieces.tensClicked && newClickedPieces.unitsClicked);
      
      return {
        ...prev,
        splitClickedPieces: newClickedPieces,
        collectedPieces: newCollectedPieces,
        // Auto-continue if conditions are met
        ...(shouldAutoContinue && handleContinueToNextLogic(prev))
      };
    });
  };

  const handleContinueToNextLogic = (currentState: typeof state) => {
    const isFirstNumber = currentState.currentNumber === problem.num1;
    
    let newPhase = currentState.currentPhase;
    let number1Updated = currentState.number1;
    let number2Updated = currentState.number2;
    
    if (isFirstNumber) {
      number1Updated = {
        ...currentState.number1,
        isDecomposed: true,
        isSelectable: false,
        tens: Math.floor(currentState.number1.value / 10),
        units: currentState.number1.value % 10
      };
      number2Updated = {
        ...currentState.number2,
        isSelectable: true
      };
      newPhase = 'number2';
    } else {
      number2Updated = {
        ...currentState.number2,
        isDecomposed: true,
        isSelectable: false,
        tens: Math.floor(currentState.number2.value / 10),
        units: currentState.number2.value % 10
      };
      newPhase = 'finalAnswer';
    }
    
    return {
      currentPhase: newPhase,
      number1: number1Updated,
      number2: number2Updated,
      currentNumber: null,
      splitClickedPieces: {
        tensClicked: false,
        unitsClicked: false,
      },
      showFinalChoices: newPhase === 'finalAnswer'
    };
  };

  const handleAnswerSelect = (selectedAnswer: number) => {
    setInteractionCount(prev => prev + 1);
    const isCorrect = selectedAnswer === problem.expectedAnswer;
    
    setState(prev => ({
      ...prev,
      currentPhase: 'complete',
      selectedAnswer,
      isCorrect,
      showFinalChoices: false
    }));
    
    setTimeout(() => {
      onComplete(isCorrect, interactionCount + 1);
    }, 2000); // Allow time for celebration animation
  };

  const generateChoices = (): number[] => {
    const correct = problem.expectedAnswer;
    const choices = [correct];
    
    // Generate plausible incorrect answers
    const incorrect1 = correct + Math.floor(Math.random() * 10) + 1;
    const incorrect2 = Math.max(1, correct - Math.floor(Math.random() * 10) - 1);
    
    choices.push(incorrect1, incorrect2);
    
    // Shuffle the choices
    return choices.sort(() => Math.random() - 0.5);
  };

  const getCurrentNumberData = () => {
    if (!state.currentNumber) return null;
    return {
      number: state.currentNumber,
      tens: Math.floor(state.currentNumber / 10),
      units: state.currentNumber % 10
    };
  };

  const numberData = getCurrentNumberData();

  return (
    <div className="layered-math-problem">
      {/* Layer 1: Question */}
      <div className="layer question-layer">
        <div className="problem-equation">
          <ClickableNumber
            number={problem.num1}
            isSelectable={state.number1.isSelectable}
            isDecomposed={state.number1.isDecomposed}
            onClick={() => handleNumberClick(problem.num1)}
          />
          <span className="operator">+</span>
          <ClickableNumber
            number={problem.num2}
            isSelectable={state.number2.isSelectable}
            isDecomposed={state.number2.isDecomposed}
            onClick={() => handleNumberClick(problem.num2)}
          />
          <span className="equals">=</span>
          <span className="question-mark">?</span>
        </div>
      </div>

      {/* Layer 2: Number Split */}
      <div className="layer split-layer">
        {state.currentNumber && numberData && (
          <div className="split-equation">
            <button 
              className={`piece-button tens-piece ${state.splitClickedPieces.tensClicked ? 'clicked' : ''}`}
              onClick={() => handlePieceClick('tens', numberData.tens)}
              disabled={numberData.tens === 0 || state.splitClickedPieces.tensClicked}
            >
              {numberData.tens * 10}
              {state.splitClickedPieces.tensClicked && <div className="piece-checkmark">✓</div>}
            </button>
            
            <span className="plus">+</span>
            
            <button 
              className={`piece-button units-piece ${state.splitClickedPieces.unitsClicked ? 'clicked' : ''}`}
              onClick={() => handlePieceClick('units', numberData.units)}
              disabled={numberData.units === 0 || state.splitClickedPieces.unitsClicked}
            >
              {numberData.units}
              {state.splitClickedPieces.unitsClicked && <div className="piece-checkmark">✓</div>}
            </button>
          </div>
        )}
      </div>

      {/* Layer 3: Collection */}
      <div className="layer collection-layer">
        {state.collectedPieces.length > 0 && (
          <div className="collection-display">
            {/* Tens Section */}
            {state.collectedPieces.filter(piece => piece >= 10).length > 0 && (
              <div className="collection-section tens-section">
                <span className="section-label">TENS:</span>
                <div className="pieces-container">
                  {state.collectedPieces
                    .filter(piece => piece >= 10)
                    .map((piece, index) => (
                      <span key={`tens-${index}`} className="collected-number tens-number">{piece}</span>
                    ))}
                </div>
              </div>
            )}
            
            {/* Units Section */}
            {state.collectedPieces.filter(piece => piece < 10).length > 0 && (
              <div className="collection-section units-section">
                <span className="section-label">UNITS:</span>
                <div className="pieces-container">
                  {state.collectedPieces
                    .filter(piece => piece < 10)
                    .map((piece, index) => (
                      <span key={`units-${index}`} className="collected-number units-number">{piece}</span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Layer 4: Final Answer */}
      {state.showFinalChoices && (
        <div className="layer final-layer">
          <h2>What is the answer?</h2>
          <MultipleChoiceAnswer
            choices={generateChoices()}
            correctAnswer={problem.expectedAnswer}
            onSelect={handleAnswerSelect}
          />
        </div>
      )}

      {/* Completion Feedback */}
      {state.currentPhase === 'complete' && (
        <div className={`completion-feedback ${state.isCorrect ? 'success' : 'incorrect'}`}>
          {state.isCorrect ? (
            <div className="success-message">
              <h2>🎉 Excellent work!</h2>
              <p>You got it right! {problem.num1} + {problem.num2} = {problem.expectedAnswer}</p>
            </div>
          ) : (
            <div className="try-again-message">
              <h2>😊 Good try!</h2>
              <p>The answer is {problem.expectedAnswer}. Let's try another problem!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveMathProblem;