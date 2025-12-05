import React from 'react';
import MathProblemStepper from './components/MathProblemStepper';
import { MathProblem } from './types/MathProblem';
import './App.css';

function App() {
  const sampleProblem: MathProblem = {
    num1: 12,
    num2: 24,
    operation: '+',
    expectedAnswer: 36
  };

  const handleProblemComplete = (correct: boolean, steps: number) => {
    console.log(`Problem completed! Correct: ${correct}, Steps taken: ${steps}`);
    // TODO: Save progress to IndexedDB
  };

  return (
    <div className="App">
      <MathProblemStepper 
        problem={sampleProblem} 
        onComplete={handleProblemComplete}
      />
    </div>
  );
}

export default App;
