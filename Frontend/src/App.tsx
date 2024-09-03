import React, {useEffect, useRef, useState} from 'react';
import logo from './ChatGPTLogo.png';
import './App.css';
import TextBox from './TextBox';
import CustomButton from './PromptButton';
import ChatField, {ChatFieldInterface} from './ChatField';
import icon from './icon.png';

function textBoxOnChange(value: string) {
  return value;
}

function App() {
  const [isVisible, setVisible] = useState(true);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [numMessages, setNumMessages] = useState(0);
  const chatFieldRef = useRef<InstanceType<typeof ChatFieldInterface> | null>(null);

  function response1(message: string) {
    setMessageToSend(message);
    setVisible(false);
    setNumMessages(numMessages+1);
  }

  useEffect(() => {
    if (!isVisible && chatFieldRef.current) {
      chatFieldRef.current.sendMessage('You', messageToSend);
    }
  }, [numMessages]);

  return (
    <div className="App">
      <header className='Header'>
        <img src={icon} className="App-icon" alt="icon" onClick={() => response1("Info")}/>
        <strong>
          JakeGPT 1.0
        </strong>
      </header>
      <>
        {isVisible && (
          <div className="Main">
            <img src={logo} className="App-logo" alt="logo" />
            <strong className='HelpText'>
              How can I help you today?
            </strong>
          </div>
        )}

        {isVisible && (
          <div className='Body'>
            <CustomButton onClick={() => response1("1")} label="Response 1"/>
            <CustomButton onClick={() => response1("2")} label="Response 2"/>
            <CustomButton onClick={() => response1("3")} label="Response 3"/>
            <CustomButton onClick={() => response1("4")} label="Response 4"/>
          </div>
        )}
      </>
      <>
        {!isVisible && (
          <div className='Body'>
            <ChatField ref={chatFieldRef}/>
          </div>
        )}
      </>
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
