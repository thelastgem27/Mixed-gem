

import React, { useRef, useState, useEffect } from 'react';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function OTPInput({ length, value, onChange, disabled, hasError }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(new Array(length).fill(''));

  useEffect(() => {
    // Sync external value to internal state
    const newDigits = value.split('').slice(0, length);
    while (newDigits.length < length) newDigits.push('');
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste
      const pasted = val.slice(0, length).split('');
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (index + i < length) newDigits[index + i] = char;
      });
      setDigits(newDigits);
      onChange(newDigits.join(''));
      
      const nextIndex = Math.min(index + pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    onChange(newDigits.join(''));

    if (val !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && digits[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-full h-12 text-center text-xl font-bold border rounded outline-none bg-transparent transition-colors ${
            hasError 
              ? 'border-red-500 focus:border-red-600 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          }`}
        />
      ))}
    </div>
  );
}
