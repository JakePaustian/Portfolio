import React, {Component, createRef, forwardRef} from 'react';

// Here we define the type for individual messages.
type Message = { user: string; messageContent: string; };

// This type defines the shape of the state object for this class.
type State = {
  messages: Message[];
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

  // Make sendMessage an instance method
  sendMessage(user: string, messageContent: string) {
    console.log(messageContent);
    this.setState(prevState => ({
      messages: [...prevState.messages, { user, messageContent }]
    }));
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

  // render() is used to define the component's DOM structure.
  render() {
    const { messages } = this.state;
    return (
      // Set width and height to 100% to expand the size of the parent div.
      <div style={{ width: '95vw', height: '85vh', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            backgroundColor: index % 2 === 0 ? '#343541' : '#292a33',
            margin: '10px',
            padding: '10px',
            borderRadius: '10px'
          }}>
            {/* Make text white */}
            <h4 style={{ color: 'white' }}>{message.user}</h4>
            <p style={{ color: 'white' }}>{message.messageContent}</p>
          </div>
        ))}
        <div ref={this.messagesEndRef} />
      </div>
    );
  }
}

const ChatField = forwardRef<InstanceType<typeof ChatFieldInterface>, {}>((props, ref) =>
  <ChatFieldInterface ref={ref} {...props} />,
);

export default ChatField;