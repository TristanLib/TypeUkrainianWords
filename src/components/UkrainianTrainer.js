import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Eye, EyeOff } from 'lucide-react';
import { vocabularyData } from '@/data/vocabulary';

// 键盘映射关系保持不变
const keyboardMap = {
  'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н',
  'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ї',
  'a': 'ф', 's': 'і', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р',
  'j': 'о', 'k': 'л', 'l': 'д', ';': 'ж', "'": 'є',
  'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т',
  'm': 'ь', ',': 'б', '.': 'ю'
};

// 键盘组件保持不变
const KeyboardKey = ({ ukChar, enChar, isPressed }) => (
  <div
    className={`
      relative w-12 h-12 border rounded flex flex-col items-center justify-center 
      transition-all duration-100 
      ${isPressed 
        ? 'bg-blue-200 transform translate-y-0.5 shadow-inner' 
        : 'bg-gray-100 shadow'}
    `}
  >
    <div className="text-lg font-medium">{ukChar}</div>
    <div className="text-xs text-gray-500 absolute bottom-1">{enChar}</div>
  </div>
);

const UkrainianKeyboard = ({ highlightKey }) => {
  const layout = [
    [
      { uk: 'й', en: 'q' }, { uk: 'ц', en: 'w' }, { uk: 'у', en: 'e' },
      { uk: 'к', en: 'r' }, { uk: 'е', en: 't' }, { uk: 'н', en: 'y' },
      { uk: 'г', en: 'u' }, { uk: 'ш', en: 'i' }, { uk: 'щ', en: 'o' },
      { uk: 'з', en: 'p' }, { uk: 'х', en: '[' }, { uk: 'ї', en: ']' }
    ],
    [
      { uk: 'ф', en: 'a' }, { uk: 'і', en: 's' }, { uk: 'в', en: 'd' },
      { uk: 'а', en: 'f' }, { uk: 'п', en: 'g' }, { uk: 'р', en: 'h' },
      { uk: 'о', en: 'j' }, { uk: 'л', en: 'k' }, { uk: 'д', en: 'l' },
      { uk: 'ж', en: ';' }, { uk: 'є', en: "'" }
    ],
    [
      { uk: 'я', en: 'z' }, { uk: 'ч', en: 'x' }, { uk: 'с', en: 'c' },
      { uk: 'м', en: 'v' }, { uk: 'и', en: 'b' }, { uk: 'т', en: 'n' },
      { uk: 'ь', en: 'm' }, { uk: 'б', en: ',' }, { uk: 'ю', en: '.' }
    ]
  ];

  return (
    <div className="flex flex-col gap-1">
      {layout.map((row, i) => (
        <div key={i} className="flex gap-1 justify-center">
          {row.map((key, j) => (
            <KeyboardKey
              key={j}
              ukChar={key.uk}
              enChar={key.en}
              isPressed={key.uk === highlightKey || keyboardMap[key.en] === highlightKey}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const UkrainianTrainer = () => {
  const [currentLesson, setCurrentLesson] = useState('lesson1');
  const [currentWord, setCurrentWord] = useState(null);
  const [input, setInput] = useState('');
  const [lastPressedKey, setLastPressedKey] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExample, setShowExample] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true); // 控制原型显示
  const inputRef = useRef(null);

  const getRandomWord = () => {
    const words = vocabularyData[currentLesson];
    return words[Math.floor(Math.random() * words.length)];
  };

  const resetWord = () => {
    setCurrentWord(getRandomWord());
    setInput('');
    setIsCorrect(null);
    setShowExample(false);
    setCursorPosition(0);
  };

  useEffect(() => {
    resetWord();
  }, [currentLesson]);

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'backspace') {
      e.preventDefault();
      setInput(prev => prev.slice(0, -1));
      setLastPressedKey(null);
      setCursorPosition(prev => Math.max(0, prev - 1));
    } else if (key in keyboardMap) {
      e.preventDefault();
      const ukChar = keyboardMap[key];
      setInput(prev => prev + ukChar);
      setLastPressedKey(ukChar);
      setCursorPosition(prev => prev + 1);
      setTimeout(() => setLastPressedKey(null), 300);
    } else if (key === 'enter') {
      e.preventDefault();
      checkInput();
    }
  };

  const checkInput = () => {
    const correct = currentWord && input === currentWord.uk;
    setIsCorrect(correct);
    if (correct) setShowExample(true);
  };

  const handleSelect = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, input]);

  // 切换原型显示
  const toggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6">
      <CardContent>
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleOriginal}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 
                     transition-colors text-sm"
          >
            {showOriginal ? (
              <>
                <EyeOff className="w-4 h-4" />
                隐藏单词原型
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                显示单词原型
              </>
            )}
          </button>
        </div>

        <Tabs defaultValue="lesson1" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="lesson1" onClick={() => setCurrentLesson('lesson1')}>
              第一课
            </TabsTrigger>
            <TabsTrigger value="lesson2" onClick={() => setCurrentLesson('lesson2')}>
              第二课
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col items-center gap-6">
            {currentWord && (
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 flex items-center gap-2 justify-center">
                  {currentWord.meaning}
                  <Volume2 className="w-6 h-6 text-blue-500 cursor-pointer" />
                </div>
                {showOriginal && (
                  <div className="text-lg text-blue-600 mb-2">
                    {currentWord.original}
                  </div>
                )}
                <div className="text-gray-500">请输入对应的乌克兰语单词</div>
              </div>
            )}

            <div className="w-full max-w-md">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onKeyDown={handleKeyDown}
                onSelect={handleSelect}
                className="w-full p-3 border rounded text-lg"
                placeholder="在此输入乌克兰语..."
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={checkInput}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                           transition-colors transform active:translate-y-0.5"
                >
                  检查
                </button>
                <button
                  onClick={resetWord}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
                           transition-colors transform active:translate-y-0.5"
                >
                  下一个
                </button>
              </div>
            </div>

            {isCorrect !== null && (
              <div className="text-center">
                <div className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isCorrect ? '正确！' : `不正确，正确答案是：${currentWord.uk}`}
                </div>
                {showExample && currentWord.example && (
                  <div className="mt-2 text-gray-600">
                    <div className="font-medium">例句：</div>
                    <div>{currentWord.example}</div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <UkrainianKeyboard highlightKey={lastPressedKey} />
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UkrainianTrainer;