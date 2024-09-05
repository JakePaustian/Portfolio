
import { ChangeEvent, FC } from 'react';

interface TextBoxProps {
  placeholder?: string;
  onChange: (value: string) => void;
  value: string
}

const TextBox: FC<TextBoxProps> = ({ placeholder, onChange, value }) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
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
