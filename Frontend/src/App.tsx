import {FormEvent, useEffect, useRef, useState} from 'react';
import logo from './ChatGPTLogo.png';
import './App.css';
import TextBox from './TextBox';
import CustomButton from './PromptButton';
import ChatField, {ChatFieldInterface} from './ChatField';
import icon from './icon.png';

function App() {
  const [isVisible, setVisible] = useState(true);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [numMessages, setNumMessages] = useState(0);
  const chatFieldRef = useRef<InstanceType<typeof ChatFieldInterface> | null>(null);

  function textBoxOnChange(value: string) {
    setMessageToSend(value);
    return value;
  }

  function response1(message: string) {
    setMessageToSend(message);
    setVisible(false);
    setNumMessages(numMessages+1);
  }

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // To prevent the form from refreshing the page
    setVisible(false);
    setNumMessages(numMessages+1);
  }

  useEffect(() => {
    if (!isVisible && chatFieldRef.current) {
      chatFieldRef.current.sendMessage(messageToSend);
    }
    setMessageToSend("");
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
            <CustomButton onClick={() => response1("Tell me about Jake's academic career.")} label="Tell me about Jake's academic career."/>
            <CustomButton onClick={() => response1("What is Jake's job experience?")} label="What is Jake's job experience?"/>
            <CustomButton onClick={() => response1("What are some of Jake's extra-circiculars?")} label="What are some of Jake's extra-circiculars?"/>
            <CustomButton onClick={() => response1("Where can I find Jake's resume or other contact information?")} label="Where can I find Jake's resume or other contact information?"/>
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
        <form onSubmit={handleSend}>
          <TextBox placeholder="Message JakeGPT..." onChange={textBoxOnChange} value={messageToSend}/>
        </form>
        <span className='disclaimer'>
          JakeGPT is actually ai-powered, so please don't say anything you wouldn't tell the real ChatGPT.
        </span>
      </footer>
    </div>
  );
}

export default App;
