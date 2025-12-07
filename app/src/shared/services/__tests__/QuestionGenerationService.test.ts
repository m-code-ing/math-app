import { QuestionGenerationService } from '../QuestionGenerationService';

describe('QuestionGenerationService', () => {
  let service: QuestionGenerationService;

  beforeEach(() => {
    service = new QuestionGenerationService();
  });

  describe('generateAdditionProblems', () => {
    it('should generate the requested number of problems', () => {
      const problems = service.generateAdditionProblems(10);
      expect(problems).toHaveLength(10);
    });

    it('should generate 20 problems when requested', () => {
      const problems = service.generateAdditionProblems(20);
      expect(problems).toHaveLength(20);
    });

    it('should generate problems with numbers between 10 and 49', () => {
      const problems = service.generateAdditionProblems(10);
      problems.forEach(problem => {
        expect(problem.num1).toBeGreaterThanOrEqual(10);
        expect(problem.num1).toBeLessThanOrEqual(49);
        expect(problem.num2).toBeGreaterThanOrEqual(10);
        expect(problem.num2).toBeLessThanOrEqual(49);
      });
    });

    it('should have correct expected answers', () => {
      const problems = service.generateAdditionProblems(10);
      problems.forEach(problem => {
        expect(problem.expectedAnswer).toBe(problem.num1 + problem.num2);
        expect(problem.operation).toBe('+');
      });
    });

    it('should generate unique problems for count <= 10', () => {
      const problems = service.generateAdditionProblems(10);
      const keys = problems.map(p => `${p.num1}+${p.num2}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(problems.length);
    });
  });

  describe('generateRecognitionQuestions', () => {
    it('should generate the requested number of questions', () => {
      const questions = service.generateRecognitionQuestions(10);
      expect(questions).toHaveLength(10);
    });

    it('should generate 20 questions when requested', () => {
      const questions = service.generateRecognitionQuestions(20);
      expect(questions).toHaveLength(20);
    });

    it('should generate numbers between 1 and 10', () => {
      const questions = service.generateRecognitionQuestions(10);
      questions.forEach(question => {
        expect(question.number).toBeGreaterThanOrEqual(1);
        expect(question.number).toBeLessThanOrEqual(10);
      });
    });

    it('should have correct answer equal to the number', () => {
      const questions = service.generateRecognitionQuestions(10);
      questions.forEach(question => {
        expect(question.correctAnswer).toBe(question.number);
      });
    });

    it('should generate unique numbers for count <= 10', () => {
      const questions = service.generateRecognitionQuestions(10);
      const numbers = questions.map(q => q.number);
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBe(10);
    });

    it('should allow duplicates for count > 10', () => {
      const questions = service.generateRecognitionQuestions(20);
      expect(questions).toHaveLength(20);
    });
  });

  describe('generateMake10Questions', () => {
    it('should generate the requested number of questions', () => {
      const questions = service.generateMake10Questions(9);
      expect(questions).toHaveLength(9);
    });

    it('should generate 20 questions when requested', () => {
      const questions = service.generateMake10Questions(20);
      expect(questions).toHaveLength(20);
    });

    it('should generate numbers between 1 and 9', () => {
      const questions = service.generateMake10Questions(9);
      questions.forEach(question => {
        expect(question.number).toBeGreaterThanOrEqual(1);
        expect(question.number).toBeLessThanOrEqual(9);
      });
    });

    it('should have correct answer that makes 10', () => {
      const questions = service.generateMake10Questions(9);
      questions.forEach(question => {
        expect(question.number + question.correctAnswer).toBe(10);
      });
    });

    it('should generate unique numbers for count <= 9', () => {
      const questions = service.generateMake10Questions(9);
      const numbers = questions.map(q => q.number);
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBe(9);
    });

    it('should allow duplicates for count > 9', () => {
      const questions = service.generateMake10Questions(20);
      expect(questions).toHaveLength(20);
    });
  });

  describe('generateAnswerChoices', () => {
    it('should generate 3 choices', () => {
      const choices = service.generateAnswerChoices(5, 'recognition');
      expect(choices).toHaveLength(3);
    });

    it('should include the correct answer', () => {
      const correctAnswer = 7;
      const choices = service.generateAnswerChoices(correctAnswer, 'recognition');
      expect(choices).toContain(correctAnswer);
    });

    it('should generate unique choices', () => {
      const choices = service.generateAnswerChoices(5, 'recognition');
      const uniqueChoices = new Set(choices);
      expect(uniqueChoices.size).toBe(3);
    });

    it('should generate choices within range for recognition mode', () => {
      const choices = service.generateAnswerChoices(5, 'recognition');
      choices.forEach(choice => {
        expect(choice).toBeGreaterThanOrEqual(1);
        expect(choice).toBeLessThanOrEqual(10);
      });
    });

    it('should generate choices within range for make10 mode', () => {
      const choices = service.generateAnswerChoices(5, 'make10');
      choices.forEach(choice => {
        expect(choice).toBeGreaterThanOrEqual(1);
        expect(choice).toBeLessThanOrEqual(9);
      });
    });
  });
});
