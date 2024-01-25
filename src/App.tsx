import React from 'react';
import logo from './ChatGPTLogo.png';
import './App.css';
import TextBox from './TextBox';
import CustomButton from './PromptButton';
import icon from './icon.png';

function textBoxOnChange(value: string) {
  return value;
}

function response1() {
  console.log('response1');
}

function App() {
  return (
    <div className="App">
      <header className='Header'>
        <img src={icon} className="App-icon" alt="icon" onClick={response1}/>
        <strong>
          JakeGPT 1.0
        </strong>
      </header>
      <div className="Main">
        <img src={logo} className="App-logo" alt="logo" />
        <strong className='HelpText'>
          How can I help you today?
        </strong>
      </div>
      <div className='Body'>
        <CustomButton onClick={response1} label="Response 1"/>
        <CustomButton onClick={response1} label="Response 2"/>
        <CustomButton onClick={response1} label="Response 3"/>
        <CustomButton onClick={response1} label="Response 4"/>
      </div>
      <footer className='Footer'>
        <TextBox placeholder="Contact me by typing here..." onChange={textBoxOnChange}/>
        <span className='disclaimer'>
          JakeGPT is not actually ai-powered, it's just meant to be memorable.
        </span>
      </footer>
    </div>
  );
}

export default App;
