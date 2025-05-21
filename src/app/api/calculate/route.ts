import { NextResponse } from 'next/server';

interface CalculateRequest {
  num1: number;
  num2?: number;
  operation: string;
  mode: 'normal' | 'scientific';
}

export async function POST(request: Request) {
  try {
    const { num1, num2, operation, mode } = await request.json() as CalculateRequest;

    if (!num1 || (mode === 'normal' && !num2) || !operation) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

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
            return NextResponse.json({ error: 'Division by zero' }, { status: 400 });
          }
          result = num1 / num2!;
          break;
        default:
          return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
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
            return NextResponse.json({ error: 'Log of non-positive number' }, { status: 400 });
          }
          result = Math.log10(num1);
          break;
        default:
          return NextResponse.json({ error: 'Invalid scientific operation' }, { status: 400 });
      }
    }
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 