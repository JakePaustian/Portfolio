import {Component, createRef, forwardRef} from 'react';

// This type defines the shape of the state object for this class.
type State = {
  messages: string[];
}

export class ChatFieldInterface extends Component<{}, State> {
  // Using Refs allows us to interact with DOM elements directly.
  // Use createRef during class creation to set up the ref.
  messagesEndRef = createRef<HTMLDivElement>();

  // Setup initial state in the constructor.
  constructor(props: {}) {
    super(props);
    this.state = {
      messages: []
    };
  }

  addMessage(messageContent: string) {
    this.setState(prevState => ({
      messages: [...prevState.messages, messageContent]
    }));
  }

  appendMessage(messageContent: string) {
    this.setState(prevState => {
      const messagesClone = [...prevState.messages];
      const lastIndex = messagesClone.length - 1;
      if (lastIndex >= 0) {
        messagesClone[lastIndex] += messageContent;
      }

      return { messages: messagesClone };
    });
  }

  sendMessage(messageContent: string) {
    this.addMessage(messageContent);
    this.addMessage("");
    let func = this.appendMessage.bind(this);

    const ws = new WebSocket('wss://3.143.211.100:8080/chat');

    ws.onopen = function() {
      console.log('Connection is open ...');
      ws.send(JSON.stringify({ message: messageContent }));
    };

    ws.onerror = function(err) {
      console.log('err: ', err);
    }

    ws.onmessage = function(event) {
      console.log('received: ' + event.data);
      const data = JSON.parse(event.data);
      if (data && data.message) {
        func(data.message);
      }
    }
  }

  // scrollToBottom scrolls the view to the latest message (the bottom of the div).
  scrollToBottom = () => {
    // Only try to scroll if the ref to the div has been initialized.
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // componentDidUpdate is a lifecycle method that's called automatically by React after render().
  // We use it here to scroll to the latest message every time the component updates (i.e., when a new message is added).
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { messages } = this.state;
    return (
      // Set width and height to 100% to expand the size of the parent div.
      <div style={{ width: '95vw', height: '83vh', overflowY: 'scroll', paddingTop: '2vh' }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            backgroundColor: index % 2 === 0 ? '#343541' : '#292a33',
            margin: '10px',
            padding: '10px',
            borderRadius: '10px'
          }}>
            <h4 style={{color: 'white'}}>{index % 2 === 0 ? "You" : "JakeGPT"}</h4>
            <p style={{color: 'white', whiteSpace: 'pre-wrap'}}>{message}</p>
          </div>
        ))}
        <div ref={this.messagesEndRef}/>
      </div>
    );
  }
}

const ChatField = forwardRef<InstanceType<typeof ChatFieldInterface>, {}>((props, ref) =>
  <ChatFieldInterface ref={ref} {...props} />,
);

export default ChatField;