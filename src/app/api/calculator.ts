import type { NextApiRequest, NextApiResponse } from 'next';

interface CalculateRequest {
  num1: number;
  num2?: number;
  operation: string;
  mode: 'normal' | 'scientific';
}

interface CalculateResponse {
  result?: number;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CalculateResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { num1, num2, operation, mode } = req.body as CalculateRequest;

  if (!num1 || (mode === 'normal' && !num2) || !operation) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    let result: number;
    if (mode === 'normal') {
      switch (operation) {
        case '+':
          result = num1 + num2!;
          break;
        case '-':
          result = num1 - num2!;
          break;
        case '*':
          result = num1 * num2!;
          break;
        case '/':
          if (num2 === 0) {
            return res.status(400).json({ error: 'Division by zero' });
          }
          result = num1 / num2!;
          break;
        default:
          return res.status(400).json({ error: 'Invalid operation' });
      }
    } else {
      switch (operation) {
        case 'sin':
          result = Math.sin(num1);
          break;
        case 'cos':
          result = Math.cos(num1);
          break;
        case 'tan':
          result = Math.tan(num1);
          break;
        case 'log':
          if (num1 <= 0) {
            return res.status(400).json({ error: 'Log of non-positive number' });
          }
          result = Math.log10(num1);
          break;
        default:
          return res.status(400).json({ error: 'Invalid scientific operation' });
      }
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}