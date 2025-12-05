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
  
  // Generate fixed choices once at component mount
  const [choices] = useState(() => {
    const correct = problem.expectedAnswer;
    const incorrect1 = correct + 5; // Always 5 more than correct
    const incorrect2 = Math.max(1, correct - 3); // Always 3 less than correct (min 1)
    return [correct, incorrect1, incorrect2];
  });

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
    
    if (isCorrect) {
      // Give time to show the green correct state, then complete
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentPhase: 'complete',
          selectedAnswer,
          isCorrect,
          showFinalChoices: false
        }));
        
        // Complete after showing the visual feedback
        onComplete(isCorrect, interactionCount + 1);
      }, 2000); // Allow time to see green checkmark
    }
    // If incorrect, do nothing - let user try again
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
        <div className="split-container">
          {/* Left Section - First Number Split */}
          <div className="split-section left-split">
            {state.currentPhase !== 'number1' && (
              <div className="split-equation">
                <button 
                  className={`piece-button tens-piece ${state.number1.isDecomposed ? 'collected' : ''}`}
                  disabled={true}
                >
                  {state.number1.tens * 10}
                </button>
                
                <span className="plus">+</span>
                
                <button 
                  className={`piece-button units-piece ${state.number1.isDecomposed ? 'collected' : ''}`}
                  disabled={true}
                >
                  {state.number1.units}
                </button>
              </div>
            )}
            {state.currentNumber === problem.num1 && (
              <div className="split-equation">
                <button 
                  className={`piece-button tens-piece ${state.splitClickedPieces.tensClicked ? 'clicked' : ''}`}
                  onClick={() => handlePieceClick('tens', Math.floor(problem.num1 / 10))}
                  disabled={Math.floor(problem.num1 / 10) === 0 || state.splitClickedPieces.tensClicked}
                >
                  {Math.floor(problem.num1 / 10) * 10}
                  {state.splitClickedPieces.tensClicked && <div className="piece-checkmark">✓</div>}
                </button>
                
                <span className="plus">+</span>
                
                <button 
                  className={`piece-button units-piece ${state.splitClickedPieces.unitsClicked ? 'clicked' : ''}`}
                  onClick={() => handlePieceClick('units', problem.num1 % 10)}
                  disabled={problem.num1 % 10 === 0 || state.splitClickedPieces.unitsClicked}
                >
                  {problem.num1 % 10}
                  {state.splitClickedPieces.unitsClicked && <div className="piece-checkmark">✓</div>}
                </button>
              </div>
            )}
          </div>

          {/* Right Section - Second Number Split */}
          <div className="split-section right-split">
            {state.currentPhase === 'finalAnswer' && (
              <div className="split-equation">
                <button 
                  className={`piece-button tens-piece ${state.number2.isDecomposed ? 'collected' : ''}`}
                  disabled={true}
                >
                  {state.number2.tens * 10}
                </button>
                
                <span className="plus">+</span>
                
                <button 
                  className={`piece-button units-piece ${state.number2.isDecomposed ? 'collected' : ''}`}
                  disabled={true}
                >
                  {state.number2.units}
                </button>
              </div>
            )}
            {state.currentNumber === problem.num2 && (
              <div className="split-equation">
                <button 
                  className={`piece-button tens-piece ${state.splitClickedPieces.tensClicked ? 'clicked' : ''}`}
                  onClick={() => handlePieceClick('tens', Math.floor(problem.num2 / 10))}
                  disabled={Math.floor(problem.num2 / 10) === 0 || state.splitClickedPieces.tensClicked}
                >
                  {Math.floor(problem.num2 / 10) * 10}
                  {state.splitClickedPieces.tensClicked && <div className="piece-checkmark">✓</div>}
                </button>
                
                <span className="plus">+</span>
                
                <button 
                  className={`piece-button units-piece ${state.splitClickedPieces.unitsClicked ? 'clicked' : ''}`}
                  onClick={() => handlePieceClick('units', problem.num2 % 10)}
                  disabled={problem.num2 % 10 === 0 || state.splitClickedPieces.unitsClicked}
                >
                  {problem.num2 % 10}
                  {state.splitClickedPieces.unitsClicked && <div className="piece-checkmark">✓</div>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Layer 3: Collection */}
      <div className="layer collection-layer">
        <div className="collection-container">
          {/* Left Section - Number 1 Collection */}
          <div className="collection-section left-collection">
            <div className="pieces-container">
              {state.collectedPieces
                .slice(0, 2) // First two pieces (from number 1)
                .map((piece, index) => (
                  <span key={`left-${index}`} className="collected-number">{piece}</span>
                ))}
            </div>
          </div>

          {/* Right Section - Number 2 Collection */}
          <div className="collection-section right-collection">
            <div className="pieces-container">
              {state.collectedPieces
                .slice(2, 4) // Last two pieces (from number 2)
                .map((piece, index) => (
                  <span key={`right-${index}`} className="collected-number">{piece}</span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Layer 4: Final Answer */}
      {state.showFinalChoices && (
        <div className="layer final-layer">
          <h2>What is the answer?</h2>
          <MultipleChoiceAnswer
            choices={choices}
            correctAnswer={problem.expectedAnswer}
            onSelect={handleAnswerSelect}
          />
        </div>
      )}

    </div>
  );
};

export default InteractiveMathProblem;