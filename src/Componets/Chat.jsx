

import React, { useState, useEffect } from "react";
import "react-chat-elements/dist/main.css";
import Navbar from "./Navbar";
import { IoMdSend } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Chat = ({
    chats,
    selectedChat,
    setChats,
}) => {
    const navigate = useNavigate();

    const location = useLocation();
    let [contact, setContact] = useState('')
    const className =
        "w-max max-w-[80%] py-1 px-1.5 rounded-lg shadow-md text-sm text-black flex items-end ";

    useEffect(() => {
        setContact(location?.state?.room?.contact)
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const msg = e.target.msg.value;
        e.target.reset();
        setChats(
            chats.map((chat) => {
                if (chat.id === selectedChat) {
                    return {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            {
                                text: msg,
                                me: true,
                                time: new Date().toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    seconds: false
                                })
                            }
                        ]
                    };
                }
                return chat;
            })
        );
    };

    const navigateToDashbord = () => {
        navigate('/dashbord')
    }
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const sendMessage = () => {
        if (newMessage.trim() === '') {
            return;
        }
        const updatedMessages = [...messages, { text: newMessage, sender: 'user' }];
        setMessages(updatedMessages);
        setNewMessage('');
    };

    return (
        <>
            <Navbar />
            <main className="container m-auto w-auto max-w-screen-lg min-w-min min-h-screen bg-cover bg-fixed ">
                <header className="bg-primary-600 sticky top-0 flex items-center justify-center py-2.5 px-2 bg-blue-400 text-black gap-3 z-30">
                    <FaArrowLeft
                        className="text-xl"
                        onClick={navigateToDashbord}
                    />
                    <img
                        src={contact.imageUrl}
                        className="rounded-full w-10 h-10 object-cover"
                    />
                    <div className="flex flex-col mr-auto">
                        <h4 className="font-medium">{contact.firstName}</h4>
                        <p className="text-xs text-start text-black">online</p>
                    </div>
                </header>

                <section className="flex flex-col gap-3 p-2 relative pb-44  ">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}$ ? "bg-blue-400 ml-auto text-white" : "bg-white"
                            } ${className}   "flex-row gap-2  " : "flex-col"} `}>
                            {message.text}
                        </div>
                    ))}
                </section>

                <form
                    onSubmit={onSubmit}
                    className="container m-auto  max-w-screen-lg fixed  bottom-0 bg-blue-400 p-2 pt-1.5  flex gap-2 items-center group "
                >
                    <div className="flex-grow flex items-center gap-3 bg-white border p-2 rounded-full text-black/50">
                        <input
                            value={newMessage}
                            onChange={handleMessageChange}
                            name="msg"
                            className="flex-grow outline-none text-black w-full"
                            type="text"
                            required
                            placeholder="Type a message"
                        />
                    </div>
                    <button type="submit" onClick={sendMessage} className="bg-primary p-3 rounded-full">
                        <IoMdSend className=" text-xl text-gray-700" />
                    </button>
                </form>
            </main>
        </>
    );
};

export default Chat
