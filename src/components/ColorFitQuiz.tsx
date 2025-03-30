import React, { useState } from 'react';

interface ColorFitQuizProps {
  onClose: () => void;
  onPaletteGenerated: (palette: string[], description: string) => void;
}

const ColorFitQuiz: React.FC<ColorFitQuizProps> = ({ onClose, onPaletteGenerated }) => {
  const questions = [
    {
      question: "What color is your skin tone?",
      options: ["Warm undertones", "Light undertone, cool", "Warm, golden undertone", "Cool or olive undertone"],
    },
    {
      question: "What’s your choice in lip color?",
      options: ["Light pink", "Pink", "Reddish pink", "Not applicable"],
    },
    {
      question: "How does your skin react to sunlight?",
      options: [
        "Burns Easily, rarely or only slightly tans",
        "Burns Moderately, tans gradually over time",
        "Rarely burns, tans easily",
        "Never or rarely ever burns, tans darkly",
      ],
    },
    {
      question: "What colors do you typically wear and feel confident in?",
      options: [
        "Cool Tones like blues, greens and violets",
        "Red Tones like reds, oranges and yellows",
        "Neutrals like blacks, whites, beige and grays",
        "Earth Tones like browns, greens and yellows",
      ],
    },
    {
      question: "What color of jewelry do you prefer to wear?",
      options: ["Gold and rose gold", "Silver", "Not applicable"],
    },
    {
      question: "Look closely at your veins by your wrist. Are they blue or green?",
      options: ["Blue", "Green"],
    },
    {
      question: "What color are your eyes?",
      options: ["Light brown, green or blue/gray", "Bright green, blue or light brown", "Dark brown or black", "Blue/green or hazel"],
    },
    {
      question: "What color is your hair?",
      options: [
        "Light blond, strawberry, light brown",
        "Dirty blond, medium brown, or ashy color",
        "Medium/darker brown or deeper red",
        "Black or dark brown",
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  const handleAnswer = (answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateSeason();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateSeason = () => {
    const warmAnswers = ["Warm undertones", "Warm, golden undertone", "Gold and rose gold", "Green"];
    const coolAnswers = ["Light undertone, cool", "Cool or olive undertone", "Silver", "Blue"];

    const warmCount = answers.filter((answer) => warmAnswers.includes(answer)).length;
    const coolCount = answers.filter((answer) => coolAnswers.includes(answer)).length;

    let palette = [];
    let description = "";

    if (warmCount > coolCount) {
      if (answers.includes("Burns Easily, rarely or only slightly tans")) {
        palette = ["#FF7F50", "#FFD700", "#8B4513"]; // Autumn palette
        description = "You have warm undertones with rich, earthy features. Your palette embraces warm, deep colors like olive green, burnt orange, and chocolate brown.";
      } else {
        palette = ["#FFDAB9", "#FFA07A", "#FFE4B5"]; // Spring palette
        description = "You have warm undertones with clear, bright features. Your palette features warm, light colors such as peach, coral, and sunny yellow.";
      }
    } else {
      if (answers.includes("Burns Easily, rarely or only slightly tans")) {
        palette = ["#87CEEB", "#4682B4", "#B0E0E6"]; // Winter palette
        description = "You have cool undertones with high contrast between your skin, hair, and eyes. Your palette includes bold, cool colors like icy blues, stark blacks, and bright jewel tones.";
      } else {
        palette = ["#E6E6FA", "#D8BFD8", "#B0C4DE"]; // Summer palette
        description = "You have cool undertones with softer, muted features. Your palette includes cool, pastel shades like lavender, soft pink, and powder blue.";
      }
    }

    onPaletteGenerated(palette, description); // Pass both palette and description
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">ColorFit Quiz</h2>
      <p className="mb-4">{questions[currentQuestion].question}</p>
      <div className="space-y-2">
        {questions[currentQuestion].options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`block w-full text-left px-4 py-2 border rounded-md ${
              answers[currentQuestion] === option ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ColorFitQuiz;