import React, { useState, useEffect } from 'react';
import { Sun, Moon, RotateCcw, CheckCircle, XCircle, Plus, BookOpen, Edit3, Trash2, Save, X } from 'lucide-react';

interface Card {
  question: string;
  answer: string;
}

interface Subject {
  name: string;
  cards: Card[];
}

const FlashcardApp: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentSubject, setCurrentSubject] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showSubjectManager, setShowSubjectManager] = useState<boolean>(false);
  const [showCardEditor, setShowCardEditor] = useState<boolean>(false);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newSubjectName, setNewSubjectName] = useState<string>('');

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      name: "JavaScript Basics",
      cards: [
        { question: "What is a closure in JavaScript?", answer: "A function that has access to variables in its outer (enclosing) scope even after the outer function has returned." },
        { question: "What is the difference between let and var?", answer: "let has block scope and cannot be redeclared, while var has function scope and can be redeclared." },
        { question: "What is the event loop?", answer: "A mechanism that handles asynchronous operations by moving completed tasks from the callback queue to the call stack." },
        { question: "What is hoisting?", answer: "JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation." },
        { question: "What is a Promise?", answer: "An object representing the eventual completion or failure of an asynchronous operation." },
        { question: "What is destructuring?", answer: "A syntax that allows unpacking values from arrays or properties from objects into distinct variables." },
        { question: "What is the spread operator?", answer: "The ... operator that expands an iterable into individual elements or copies properties from one object to another." },
        { question: "What is async/await?", answer: "Syntax that makes it easier to work with Promises by allowing asynchronous code to be written in a synchronous style." }
      ]
    },
    {
      name: "React Fundamentals",
      cards: [
        { question: "What is JSX?", answer: "A syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files." },
        { question: "What is a React component?", answer: "A reusable piece of UI that can accept props and return JSX elements." },
        { question: "What is the difference between state and props?", answer: "State is internal data that a component manages, while props are external data passed to a component from its parent." },
        { question: "What is the Virtual DOM?", answer: "A JavaScript representation of the actual DOM that React uses to optimize updates by comparing changes before applying them." }
      ]
    },
    {
      name: "Python Programming",
      cards: [
        { question: "What is a list comprehension in Python?", answer: "A concise way to create lists using a single line of code with optional conditions." },
        { question: "What is the difference between a tuple and a list?", answer: "Tuples are immutable and ordered, while lists are mutable and ordered." },
        { question: "What is a decorator in Python?", answer: "A function that takes another function and extends its behavior without explicitly modifying it." },
        { question: "What is the Global Interpreter Lock (GIL)?", answer: "A mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously." }
      ]
    }
  ]);

  const currentSubjectData = subjects[currentSubject];
  const flashcards = currentSubjectData?.cards || [];
  const progress = flashcards.length > 0 ? ((currentCard + 1) / flashcards.length) * 100 : 0;
  const confidenceScore = answered.size > 0 ? Math.round((confidence / answered.size) * 100) : 0;

  const handleFlip = (): void => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect: boolean): void => {
    if (!answered.has(currentCard)) {
      setAnswered(new Set([...answered, currentCard]));
      setConfidence(prev => prev + (isCorrect ? 1 : 0));
    }
    
    setTimeout(() => {
      if (currentCard < flashcards.length - 1) {
        setCurrentCard(prev => prev + 1);
        setIsFlipped(false);
      } else {
        setShowCelebration(true);
      }
    }, 300);
  };

  const resetDeck = (): void => {
    setCurrentCard(0);
    setIsFlipped(false);
    setConfidence(0);
    setAnswered(new Set());
    setShowCelebration(false);
  };

  const switchSubject = (index: number): void => {
    setCurrentSubject(index);
    resetDeck();
    setShowSubjectManager(false);
  };

  const addNewSubject = (): void => {
    if (newSubjectName.trim()) {
      setSubjects([...subjects, { name: newSubjectName.trim(), cards: [] }]);
      setNewSubjectName('');
    }
  };

  const deleteSubject = (index: number): void => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
      if (currentSubject >= newSubjects.length) {
        setCurrentSubject(0);
        resetDeck();
      }
    }
  };

  const addNewCard = (): void => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const updatedSubjects = [...subjects];
      updatedSubjects[currentSubject].cards.push({
        question: newQuestion.trim(),
        answer: newAnswer.trim()
      });
      setSubjects(updatedSubjects);
      setNewQuestion('');
      setNewAnswer('');
      setShowCardEditor(false);
    }
  };

  const editCard = (index: number): void => {
    const card = flashcards[index];
    setEditingCard(index);
    setNewQuestion(card.question);
    setNewAnswer(card.answer);
    setShowCardEditor(true);
  };

  const saveEditedCard = (): void => {
    if (newQuestion.trim() && newAnswer.trim() && editingCard !== null) {
      const updatedSubjects = [...subjects];
      updatedSubjects[currentSubject].cards[editingCard] = {
        question: newQuestion.trim(),
        answer: newAnswer.trim()
      };
      setSubjects(updatedSubjects);
      setNewQuestion('');
      setNewAnswer('');
      setEditingCard(null);
      setShowCardEditor(false);
    }
  };

  const deleteCard = (index: number): void => {
    const updatedSubjects = [...subjects];
    updatedSubjects[currentSubject].cards.splice(index, 1);
    setSubjects(updatedSubjects);
    if (currentCard >= updatedSubjects[currentSubject].cards.length) {
      setCurrentCard(Math.max(0, updatedSubjects[currentSubject].cards.length - 1));
    }
  };

  const cancelCardEditor = (): void => {
    setShowCardEditor(false);
    setEditingCard(null);
    setNewQuestion('');
    setNewAnswer('');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.code === 'Space' && !showSubjectManager && !showCardEditor) {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showSubjectManager, showCardEditor]);

  // Custom styles object for 3D card flip
  const customStyles = {
    perspective: { perspective: '1000px' },
    preserve3d: { transformStyle: 'preserve-3d' as const },
    backfaceHidden: { backfaceVisibility: 'hidden' as const },
    rotateY180: { transform: 'rotateY(180deg)' }
  };

  if (showSubjectManager) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className={`flex justify-between items-center mb-8 p-4 rounded-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} shadow-lg`}>
            <h1 className="text-2xl font-bold">Manage Subjects</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'} shadow-lg`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setShowSubjectManager(false)}
                className={`px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} shadow-lg`}
              >
                Back to Study
              </button>
            </div>
          </div>

          {/* Add New Subject */}
          <div className={`mb-6 p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/60'} shadow-lg backdrop-blur-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Add New Subject</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name..."
                className={`flex-1 px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                onKeyPress={(e) => e.key === 'Enter' && addNewSubject()}
              />
              <button
                onClick={addNewSubject}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          {/* Subjects List */}
          <div className="grid gap-4">
            {subjects.map((subject, index) => (
              <div key={index} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} shadow-lg backdrop-blur-sm`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{subject.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {subject.cards.length} cards
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => switchSubject(index)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      Study
                    </button>
                    {subjects.length > 1 && (
                      <button
                        onClick={() => deleteSubject(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showCardEditor) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} shadow-lg backdrop-blur-sm`}>
            <h2 className="text-2xl font-bold mb-6">
              {editingCard !== null ? 'Edit Card' : 'Add New Card'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Question
                </label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter your question..."
                  className={`w-full px-4 py-3 rounded-lg border h-24 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Answer
                </label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  className={`w-full px-4 py-3 rounded-lg border h-32 resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingCard !== null ? saveEditedCard : addNewCard}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Save size={16} />
                {editingCard !== null ? 'Save Changes' : 'Add Card'}
              </button>
              <button
                onClick={cancelCardEditor}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className={`flex justify-between items-center mb-8 p-4 rounded-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} shadow-lg`}>
          <div>
            <h1 className="text-2xl font-bold">{currentSubjectData?.name}</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Confidence: <span className="font-semibold text-green-500">{confidenceScore}%</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSubjectManager(true)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'} shadow-lg`}
            >
              <BookOpen size={20} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'} shadow-lg`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Subject Selector */}
        <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/60'} shadow-lg backdrop-blur-sm`}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {subjects.map((subject, index) => (
              <button
                key={index}
                onClick={() => switchSubject(index)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 hover:scale-105 ${
                  index === currentSubject 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {flashcards.length === 0 ? (
          <div className={`text-center p-12 rounded-2xl ${darkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} shadow-lg backdrop-blur-sm mb-8`}>
            <BookOpen size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <h2 className="text-2xl font-bold mb-2">No Cards Yet</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Add some flashcards to start studying this subject.
            </p>
            <button
              onClick={() => setShowCardEditor(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add First Card
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className={`mb-8 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/60'} shadow-lg backdrop-blur-sm`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Progress
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currentCard + 1} / {flashcards.length}
                </span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Flashcard */}
            {!showCelebration ? (
              <div style={customStyles.perspective} className="mb-8">
                <div 
                  className={`relative w-full h-80 cursor-pointer transition-transform duration-700`}
                  style={{
                    ...customStyles.preserve3d,
                    ...(isFlipped ? customStyles.rotateY180 : {})
                  }}
                  onClick={handleFlip}
                >
                  {/* Front of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-white' : 'bg-gradient-to-br from-white to-blue-50 text-gray-800'} border-2 ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}
                    style={customStyles.backfaceHidden}
                  >
                    <div className="p-8 h-full flex flex-col justify-center items-center text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editCard(currentCard);
                        }}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <div className={`text-sm font-medium mb-4 px-3 py-1 rounded-full ${darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                        Question
                      </div>
                      <h2 className="text-xl font-semibold leading-relaxed">
                        {flashcards[currentCard]?.question}
                      </h2>
                      <div className={`mt-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click to reveal answer
                      </div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div 
                    className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl ${darkMode ? 'bg-gradient-to-br from-green-800 to-green-700 text-white' : 'bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800'} border-2 ${darkMode ? 'border-green-600' : 'border-green-200'}`}
                    style={{
                      ...customStyles.backfaceHidden,
                      ...customStyles.rotateY180
                    }}
                  >
                    <div className="p-8 h-full flex flex-col justify-center items-center text-center">
                      <div className={`text-sm font-medium mb-4 px-3 py-1 rounded-full ${darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        Answer
                      </div>
                      <p className="text-lg leading-relaxed">
                        {flashcards[currentCard]?.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Celebration Screen */
              <div className={`text-center p-12 rounded-2xl ${darkMode ? 'bg-gray-800/50 text-white' : 'bg-white/60 text-gray-800'} shadow-lg backdrop-blur-sm mb-8`}>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You've completed {currentSubjectData?.name} with {confidenceScore}% confidence!
                </p>
                <button
                  onClick={resetDeck}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <RotateCcw size={20} />
                  Study Again
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {isFlipped && !showCelebration && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleAnswer(false)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg ${darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  <XCircle size={20} />
                  Don't Know
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                  <CheckCircle size={20} />
                  Know
                </button>
              </div>
            )}

            {/* Instructions & Quick Actions */}
            {!isFlipped && !showCelebration && (
              <div className={`text-center mt-8 p-4 rounded-xl ${darkMode ? 'bg-gray-800/30 text-gray-300' : 'bg-white/30 text-gray-600'} backdrop-blur-sm`}>
                <div className="flex justify-center gap-4 mb-3">
                  <button
                    onClick={() => setShowCardEditor(true)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'} shadow-lg flex items-center gap-2`}
                  >
                    <Plus size={16} />
                    Add Card
                  </button>
                  {flashcards.length > 1 && (
                    <button
                      onClick={() => deleteCard(currentCard)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'} shadow-lg flex items-center gap-2`}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm">
                  Press <kbd className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Space</kbd> or click the card to flip
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlashcardApp;