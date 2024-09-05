import {FormEvent, useEffect, useRef, useState} from 'react';
import logo from './ChatGPTLogo.png';
import './App.css';
import TextBox from './TextBox';
import CustomButton from './PromptButton';
import ChatField, {ChatFieldInterface} from './ChatField';
import icon from './icon.png';
import close from './close.png';

function App() {
  const [isVisible, setVisible] = useState(true);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [numMessages, setNumMessages] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const chatFieldRef = useRef<InstanceType<typeof ChatFieldInterface> | null>(null);

  function openModal() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

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
    if (messageToSend.length !== 0) {
      setVisible(false);
      setNumMessages(numMessages+1);
    }
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
        <img src={icon} className="App-icon" alt="icon" onClick={openModal}/>
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
          <input type="submit" id="hiddenSubmit" style={{display: "none"}}/>
        </form>
        <span className='disclaimer'>
          JakeGPT is actually ai-powered, so please don't say anything you wouldn't tell the real ChatGPT.
        </span>
      </footer>
      {isModalVisible && (
        <>
          <div className="backdrop" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-header">
              <h2>Contact and Info</h2>
              <img src={close} alt="close" className="modal-close-button" onClick={closeModal}/>
            </div>
            <strong>Thank you so much for stopping by my portfolio site!</strong>
            <p>You can find more about me and contact me through these links:</p>
            <ul>
              <li><a href="https://www.linkedin.com/in/jake-paustian/" target="_blank"
                     rel="noopener noreferrer">LinkedIn</a></li>
              <li><a
                href="https://www.dropbox.com/scl/fi/63y9wrl0dq1m8hnutto2z/JakePaustian_resume_2024.pdf?rlkey=3ud0bq9cyqwixhg5uv0xsnwtx&st=1vw2c9md&dl=1"
                target="_blank" rel="noopener noreferrer">Resume</a></li>
              <li><a href="https://github.com/JakePaustian/Portfolio/" target="_blank"
                     rel="noopener noreferrer">Github</a></li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
