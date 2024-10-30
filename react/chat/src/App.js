import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const BOT_IMAGE = 'https://media.istockphoto.com/id/1957053641/vector/cute-kawaii-robot-character-friendly-chat-bot-assistant-for-online-applications-cartoon.jpg?s=1024x1024&w=is&k=20&c=YdqOyHPBiCpGgc49jYTzeIUv_FL0Q_bvMU_oRZnpdmw=';
const HUMAN_IMAGE = 'https://media.istockphoto.com/id/1268548918/vector/white-create-account-screen-icon-isolated-with-long-shadow-red-circle-button-vector.jpg?s=2048x2048&w=is&k=20&c=YSFQ6smXI8dUSY79Peo7ZIxqebn0qHMWLOsE6QIsjpI=';


async function call_agent(message) {
  const url = "https://paqbp62e85.execute-api.us-east-1.amazonaws.com/dev/";

  // Define the headers
  const headers = {
    "Content-Type": "application/json"
  };

  // Define the JSON payload
  const payload = {
    system: {
      content: "helpful appointment scheduler receptionist, find out if the user would like to schedule an appointment and collect their phone number."
    },
    user: {
      content: message
    }
  };
  // Make the POST request to the API endpoint
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });
    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON response
    const data = await response.json();
    return { content: data.body.content || "Something went wrong", role: "agent" };
  } catch (error) {
    console.error("Error:", error);
    // Log more details to help identify the issue
    if (error instanceof TypeError) {
      console.error("Network error or CORS issue:", error.message);
    } 
    console.error("Unexpected error:", error.message);
    
    return { content: "I'm having trouble connecting right now. Please try again later.", role: "agent" };
  }
}


function App() {
  return (
    <div className="App">
      <header>
        <h1>Appointment Scheduler</h1>
      </header>
      <section>
        <ChatRoom />
      </section>
    </div>
  );
}

function ChatRoom() {
  const chatContainerRef = useRef();
  const [messages, setMessages] = useState([
    { id: 'initial', 'content': "Hello! I'd like to help set up your appointment. Could you please provide your phone number so we can chat?", role: "agent" },
  ]);
  const [formValue, setFormValue] = useState('');

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const userMessage = { id: Date.now(), content: formValue, role: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setFormValue('');

    // Wait for the agent's response asynchronously
    const agentMessage = await call_agent(formValue);
    setMessages((prevMessages) => [...prevMessages, { ...agentMessage, id: Date.now() + 1 }]);
  };

  return (
    <>
      <main ref={chatContainerRef} className="chat-container">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </main>
      
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { content, role } = props.message;
  const messageClass = role === 'user' ? 'sent' : 'received';
  const image = role === 'user' ? HUMAN_IMAGE : BOT_IMAGE;

  return (
    <div className={`message ${messageClass}`}>
      <img src={image} alt="Avatar" />
      <p>{content}</p>
    </div>
  );
}

export default App;
