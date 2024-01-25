
import React, { ChangeEvent, FC, useState } from 'react';

interface TextBoxProps {
  placeholder?: string;
  onChange: (value: string) => void;
}

const TextBox: FC<TextBoxProps> = ({ placeholder, onChange }) => {
  const [value, setValue] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    onChange(inputValue);
  };

  return (
    <input
      className='TextBox'
      value={value}
      placeholder={placeholder}
      onChange={handleInputChange}
    />
  );
};

export default TextBox;
