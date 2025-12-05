import React, { useState } from 'react';
import { ProblemState, ProblemStep, MathProblem, NumberBreakdown } from '../types/MathProblem';
import NumberDecomposition from './NumberDecomposition';
import './MathProblemStepper.css';

interface MathProblemStepperProps {
  problem: MathProblem;
  onComplete: (correct: boolean, steps: number) => void;
}

const MathProblemStepper: React.FC<MathProblemStepperProps> = ({ problem, onComplete }) => {
  const [state, setState] = useState<ProblemState>({
    currentStep: ProblemStep.DECOMPOSE_FIRST,
    number1: { value: problem.num1, tens: 0, units: 0 },
    number2: { value: problem.num2, tens: 0, units: 0 },
    tensResult: 0,
    unitsResult: 0,
    finalAnswer: 0,
    needsRegrouping: false,
    isComplete: false,
  });

  const updateNumber1 = (breakdown: NumberBreakdown) => {
    setState(prev => ({
      ...prev,
      number1: breakdown,
      currentStep: ProblemStep.DECOMPOSE_SECOND
    }));
  };

  const updateNumber2 = (breakdown: NumberBreakdown) => {
    setState(prev => ({
      ...prev,
      number2: breakdown,
      currentStep: ProblemStep.ADD_TENS
    }));
  };

  const updateTensResult = (result: number) => {
    setState(prev => ({
      ...prev,
      tensResult: result,
      currentStep: ProblemStep.ADD_UNITS
    }));
  };

  const updateUnitsResult = (result: number) => {
    const needsRegrouping = result >= 10;
    setState(prev => ({
      ...prev,
      unitsResult: result,
      needsRegrouping,
      currentStep: needsRegrouping ? ProblemStep.REGROUP : ProblemStep.FINAL_ANSWER
    }));
  };

  const updateAfterRegrouping = (extraTens: number, remainingUnits: number) => {
    setState(prev => ({
      ...prev,
      tensResult: prev.tensResult + extraTens,
      unitsResult: remainingUnits,
      needsRegrouping: false,
      currentStep: ProblemStep.FINAL_ANSWER
    }));
  };

  const updateFinalAnswer = (answer: number) => {
    const isCorrect = answer === problem.expectedAnswer;
    setState(prev => ({
      ...prev,
      finalAnswer: answer,
      isComplete: true
    }));
    onComplete(isCorrect, state.currentStep);
  };

  const getTotalSteps = () => {
    return state.needsRegrouping ? 6 : 5;
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case ProblemStep.DECOMPOSE_FIRST:
        return (
          <div className="step-container">
            <h2>Step 1: Break down the first number</h2>
            <div className="problem-display">
              <span className="number-highlight">{problem.num1}</span> + {problem.num2}
            </div>
            <p>How many tens and units are in <strong>{problem.num1}</strong>?</p>
            <NumberDecomposition 
              number={problem.num1} 
              onComplete={updateNumber1} 
            />
          </div>
        );

      case ProblemStep.DECOMPOSE_SECOND:
        return (
          <div className="step-container">
            <h2>Step 2: Break down the second number</h2>
            <div className="problem-display">
              {problem.num1} + <span className="number-highlight">{problem.num2}</span>
            </div>
            <div className="previous-work">
              ✓ {problem.num1} = {state.number1.tens} tens + {state.number1.units} units
            </div>
            <p>How many tens and units are in <strong>{problem.num2}</strong>?</p>
            <NumberDecomposition 
              number={problem.num2} 
              onComplete={updateNumber2} 
            />
          </div>
        );

      case ProblemStep.ADD_TENS:
        return (
          <div className="step-container">
            <h2>Step 3: Add the tens</h2>
            <div className="previous-work">
              ✓ {problem.num1} = {state.number1.tens} tens + {state.number1.units} units<br/>
              ✓ {problem.num2} = {state.number2.tens} tens + {state.number2.units} units
            </div>
            <p>{state.number1.tens} tens + {state.number2.tens} tens = ?</p>
            <div className="placeholder">
              TensAddition component
            </div>
          </div>
        );

      case ProblemStep.ADD_UNITS:
        return (
          <div className="step-container">
            <h2>Step 4: Add the units</h2>
            <div className="previous-work">
              ✓ {state.number1.tens} tens + {state.number2.tens} tens = {state.tensResult} tens
            </div>
            <p>{state.number1.units} units + {state.number2.units} units = ?</p>
            <div className="placeholder">
              UnitsAddition component
            </div>
          </div>
        );

      case ProblemStep.REGROUP:
        return (
          <div className="step-container">
            <h2>Step 5: Regroup the units</h2>
            <div className="previous-work">
              ✓ {state.number1.units} units + {state.number2.units} units = {state.unitsResult} units
            </div>
            <p>Since {state.unitsResult} ≥ 10, we need to regroup!</p>
            <p>{state.unitsResult} units = ? tens + ? units</p>
            <div className="placeholder">
              RegroupingStep component
            </div>
          </div>
        );

      case ProblemStep.FINAL_ANSWER:
        return (
          <div className="step-container">
            <h2>Step {state.needsRegrouping ? '6' : '5'}: Final Answer</h2>
            <div className="previous-work">
              ✓ Total tens: {state.tensResult}<br/>
              ✓ Total units: {state.unitsResult}
            </div>
            <p>{state.tensResult} tens + {state.unitsResult} units = ?</p>
            <div className="placeholder">
              FinalAnswer component
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="math-problem-stepper">
      <div className="step-progress">
        Step {state.currentStep} of {getTotalSteps()}
      </div>
      
      <div className="problem-header">
        <h1>{problem.num1} + {problem.num2} = ?</h1>
      </div>

      {renderCurrentStep()}
      
      {state.isComplete && (
        <div className="completion-message">
          <h3>🎉 Great job!</h3>
          <p>You solved {problem.num1} + {problem.num2} = {state.finalAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default MathProblemStepper;