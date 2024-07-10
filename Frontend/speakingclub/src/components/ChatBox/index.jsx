import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './cbox.css';

const ChatBox = ({socketRef}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    const newMessage = {
      text: inputText,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://ui-avatars.com/api/?name=raj&background=0D8ABC&color=fff',
    };
    const sendMsg = {
      text: inputText,
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://ui-avatars.com/api/?name=raj&background=0D8ABC&color=fff',
    }
    setMessages([...messages, newMessage]);
    setInputText('');
    socketRef.current.emit('send message',sendMsg);
  };
  
useEffect(() => {
    // const currentSocketRef = socketRef.current;
    

    chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });

    // Set up event listener to receive new messages
    socketRef.current.on('new message', (message) => {
      
        console.log("message")
        setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the event listener when component unmounts
    return () => {
      socketRef.current.off('new message');
    };
}, [socketRef]);

  return (
    <Draggable position="fixed" defaultPosition={{ x: 540, y: -30}} >
      <div className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <FontAwesomeIcon icon={faComments} /> Simple Chat
          </div>
        </header>

        <main className="msger-chat">
          {messages.map((message, index) => (
            <div key={index} className={message.isUser ? 'msg right-msg' : 'msg left-msg'}>
              {!message.isUser && <img className="msg-img" src={message.avatar} alt="Avatar" />}
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{message.isUser ? 'You' : message.name}</div>
                  <div className="msg-info-time">{message.time}</div>
                </div>
                <div className="msg-text">{message.text}</div>
              </div>
              {message.isUser && <img className="msg-img" src={message.avatar} alt="Avatar" />}
            </div>
          ))}
          <div ref={chatBottomRef}></div>
        </main>

        <form className="msger-inputarea" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="msger-send-btn"><FontAwesomeIcon icon={faPaperPlane} /></button>
        </form>
      </div>
    </Draggable>
  );
};

export default ChatBox;