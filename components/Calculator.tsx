import { useState, useEffect } from 'react';

interface CalculatorProps {
  theme: 'dark' | 'gray' | 'purple';
}

const Calculator: React.FC<CalculatorProps> = ({ theme }) => {
  const [display, setDisplay] = useState<string>('0');
  const [mode, setMode] = useState<'normal' | 'scientific'>('normal');
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const themeStyles = {
    dark: 'bg-gray-900 text-white',
    gray: 'bg-gray-200 text-black',
    purple: 'bg-purple-950 text-white',
  };

  const buttonStyles = {
    dark: 'bg-gray-700 hover:bg-gray-600',
    gray: 'bg-gray-400 hover:bg-gray-500',
    purple: 'bg-purple-800 hover:bg-purple-700',
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      
      // Handle numbers and decimal
      if (/^[0-9.]$/.test(key)) {
        handleNumber(key);
      }
      // Handle operations
      else if (['+', '-', '*', '/'].includes(key)) {
        handleOperation(key);
      }
      // Handle equals
      else if (key === 'Enter' || key === '=') {
        handleCalculate();
      }
      // Handle clear
      else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [num1, num2, operation]); // Add dependencies to ensure latest state is used

  const handleNumber = (value: string) => {
    if (operation) {
      setNum2((prev) => prev + value);
      setDisplay((prev) => prev + value);
    } else {
      setNum1((prev) => prev + value);
      setDisplay((prev) => (prev === '0' ? value : prev + value));
    }
  };

  const handleOperation = (op: string) => {
    if (num1) {
      setOperation(op);
      setDisplay((prev) => prev + op);
    }
  };

  const handleCalculate = async () => {
    if (!num1 || !num2 || !operation) {
      setError('Please enter valid numbers and operation');
      return;
    }

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num1: parseFloat(num1),
          num2: parseFloat(num2),
          operation,
          mode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.result.toString());
        setDisplay(data.result.toString());
        setNum1(data.result.toString());
        setNum2('');
        setOperation('');
      } else {
        setError(data.error || 'Calculation failed');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setError('An error occurred during calculation');
    }
  };

  const handleScientific = async (func: string) => {
    if (!num1) {
      setError('Please enter a number');
      return;
    }

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num1: parseFloat(num1),
          operation: func,
          mode: 'scientific',
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.result.toString());
        setDisplay(data.result.toString());
        setNum1(data.result.toString());
      } else {
        setError(data.error || 'Calculation failed');
      }
    } catch (error) {
      console.error('Scientific calculation error:', error);
      setError('An error occurred during scientific calculation');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setNum1('');
    setNum2('');
    setOperation('');
    setResult(null);
    setError(null);
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${themeStyles[theme]}`}>
      <h1 className="text-2xl font-bold mb-4 text-center">Calculator</h1>
      <div className="mb-4">
        <div className="w-full p-2 border rounded bg-gray-100 text-black text-right text-xl">
          {display}
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setMode(mode === 'normal' ? 'scientific' : 'normal')}
            className={`p-2 rounded ${buttonStyles[theme]}`}
          >
            {mode === 'normal' ? 'Scientific' : 'Normal'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['7', '8', '9', '/'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '/' ? handleOperation(btn) : handleNumber(btn))}
              className={`p-2 rounded ${buttonStyles[theme]}`}
            >
              {btn}
            </button>
          ))}
          {['4', '5', '6', '*'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '*' ? handleOperation(btn) : handleNumber(btn))}
              className={`p-2 rounded ${buttonStyles[theme]}`}
            >
              {btn}
            </button>
          ))}
          {['1', '2', '3', '-'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '-' ? handleOperation(btn) : handleNumber(btn))}
              className={`p-2 rounded ${buttonStyles[theme]}`}
            >
              {btn}
            </button>
          ))}
          {['0', '.', '=', '+'].map((btn) => (
            <button
              key={btn}
              onClick={() =>
                btn === '=' ? handleCalculate() : btn === '+' ? handleOperation(btn) : handleNumber(btn)
              }
              className={`p-2 rounded ${buttonStyles[theme]}`}
            >
              {btn}
            </button>
          ))}
          {mode === 'scientific' && (
            <>
              {['sin', 'cos', 'tan', 'log'].map((func) => (
                <button
                  key={func}
                  onClick={() => handleScientific(func)}
                  className={`p-2 rounded ${buttonStyles[theme]}`}
                >
                  {func}
                </button>
              ))}
            </>
          )}
          <button onClick={handleClear} className={`p-2 rounded ${buttonStyles[theme]} col-span-4`}>
            Clear
          </button>
        </div>
      </div>
      {result && <p className="text-green-600 text-center">Result: {result}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default Calculator;