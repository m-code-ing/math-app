import React from 'react';
import InteractiveMathProblem from './components/InteractiveMathProblem';
import { MathProblem } from './types/InteractiveMath';
import './App.css';

function App() {
  const sampleProblem: MathProblem = {
    num1: 12,
    num2: 24,
    operation: '+',
    expectedAnswer: 36
  };

  const handleProblemComplete = (correct: boolean, interactions: number) => {
    console.log(`Problem completed! Correct: ${correct}, Interactions: ${interactions}`);
    // TODO: Save progress to IndexedDB
  };

  return (
    <div className="App">
      <InteractiveMathProblem 
        problem={sampleProblem} 
        onComplete={handleProblemComplete}
      />
    </div>
  );
}

export default App;
