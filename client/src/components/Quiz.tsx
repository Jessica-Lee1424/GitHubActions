import { useState, useEffect } from 'react';
import type { Question } from '../models/Question.js';
import { getQuestions } from '../services/questionApi.js';

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question

  const getRandomQuestions = async () => {
    try {
      const questions = await getQuestions();

      if (!questions) {
        throw new Error('something went wrong!');
      }

      setQuestions(questions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setTimeLeft(30); // Reset timer for the next question
    } else {
      setQuizCompleted(true);
    }
  };

  const handleStartQuiz = async () => {
    await getRandomQuestions();
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(30); // Reset timer when starting the quiz
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    // Clear timer on component unmount or when the question changes
    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timeLeft === 0) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setTimeLeft(30); // Reset timer for the next question
      } else {
        setQuizCompleted(true);
      }
    }
  }, [timeLeft, currentQuestionIndex, questions.length]);

  if (!quizStarted) {
    return (
      <div className="p-4 text-center">
        <button className="btn btn-primary d-inline-block mx-auto" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="card p-4 text-center">
        <h2>Quiz Completed</h2>
        <div className="alert alert-success">
          Your score: {score}/{questions.length}
        </div>
        <button className="btn btn-primary d-inline-block mx-auto" onClick={handleStartQuiz}>
          Take New Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className='card p-4'>
      <h2>{currentQuestion.question}</h2>
      <div className="alert alert-info">Time Left: {timeLeft} seconds</div>
      <div className="mt-3">
        {currentQuestion.answers.map((answer, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <button className="btn btn-primary" onClick={() => handleAnswerClick(answer.isCorrect)}>
              {index + 1}
            </button>
            <div className="alert alert-secondary mb-0 ms-2 flex-grow-1">{answer.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;