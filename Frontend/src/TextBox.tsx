import { ChangeEvent, FC } from 'react';
import icon from './send.png';

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
    <div className='TextFooter'>
      <input
        className='TextBox'
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
      />
      <img src={icon} className="send-icon" alt="icon" onClick={() => {
        const submitButton = document.getElementById('hiddenSubmit') as HTMLButtonElement;
        submitButton?.click();
      }}/>
    </div>
  );
};

export default TextBox;