import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const BOT_IMAGE = 'https://media.istockphoto.com/id/1957053641/vector/cute-kawaii-robot-character-friendly-chat-bot-assistant-for-online-applications-cartoon.jpg?s=1024x1024&w=is&k=20&c=YdqOyHPBiCpGgc49jYTzeIUv_FL0Q_bvMU_oRZnpdmw=';
const HUMAN_IMAGE = 'https://media.istockphoto.com/id/1268548918/vector/white-create-account-screen-icon-isolated-with-long-shadow-red-circle-button-vector.jpg?s=2048x2048&w=is&k=20&c=YSFQ6smXI8dUSY79Peo7ZIxqebn0qHMWLOsE6QIsjpI=';


async function call_customer(number) {
  const url = "https://paqbp62e85.execute-api.us-east-1.amazonaws.com/dev/VAPI/";
  const headers = {
    "Content-Type": "application/json"
  };
  console.log(number,number)
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({number})
    });
  } catch (error) {
    console.error("Error:", error);
    console.error("Unexpected error:", error.message);
    return { content: "I'm having trouble connecting right now. Please try again later.", role: "assistant" };
  }
}



async function call_agent(messages) {
  const url = "https://paqbp62e85.execute-api.us-east-1.amazonaws.com/dev/GPT/";

  // Define the headers
  const headers = {
    "Content-Type": "application/json"
  };

  // Make the POST request to the API endpoint
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(messages)
    });
    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON response
    const data = await response.json();
    console.log(data)
    if (data.body.content) {
      return { content: data.body.content, role: "assistant" }
    }
    let contact_info = JSON.parse(data.body.function_call.arguments)
    if (contact_info) {
      call_customer(contact_info.phoneNumber)
      return { content: "Thank you! I shall call now.", role: "assistant" };
    } else {
      return { content: data.body.content || "Something went wrong", role: "assistant" };
    }
  } catch (error) {
    console.error("Error:", error);
    // Log more details to help identify the issue
    if (error instanceof TypeError) {
      console.error("Network error or CORS issue:", error.message);
    } 
    console.error("Unexpected error:", error.message);
    
    return { content: "I'm having trouble connecting right now. Please try again later.", role: "assistant" };
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
    { id: 'initial', 'content': "Hello! How can I help you today", role: "assistant" },
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
    const agentMessage = await call_agent([...messages, userMessage]);
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
