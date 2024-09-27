

import React, { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { collection, doc, updateDoc, onSnapshot, query, orderBy, limit, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MessageList, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { ImagePicker } from 'react-file-picker';
import Navbar from "./Navbar";
import Contacts from "./Contacts";
import Header from "./Header";
import { IoMdSend } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useParams, useNavigate } from "react-router-dom"; // Import necessary hooks

const defaultChats = [
    {
        id: 3,
        name: "Elon Musk",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfoHR4N4fK95SQ6cyL0knP9vAMcWa2hrjNh2lv-c4wbA&s",
        unread: 0,
        messages: [
            {
                me: true,
                text: "Hey Elon! What's the next big thing you're working on?",
                time: "11:45 AM"
            },
            {
                me: false,
                text:
                    "Thinking about a Mars vacation or maybe a new electric rocket car. You in?",
                time: "11:50 AM"
            },
            {
                me: true,
                text: "Sign me up for the Mars trip! Can I pay in Dogecoin?",
                time: "11:55 AM"
            },
            {
                me: false,
                text: "Of course! It's the currency of the future, after all. 😄",
                time: "12:00 PM"
            },
            {
                me: true,
                text:
                    "But Elon, what about a Tesla that can fly? Imagine the traffic solutions!",
                time: "12:05 PM"
            },
            {
                me: false,
                text:
                    "Flying Teslas? Now that's an interesting idea. We might need to work on a landing pad feature.",
                time: "12:10 PM"
            },
            {
                me: true,
                text: "A landing pad on top of my house for the Tesla Flyer? I'm in!",
                time: "12:15 PM"
            },
            {
                me: false,
                text:
                    "Great! We'll call it 'Tesla Flyer: Taking Commutes to New Heights'. Catchy, right?",
                time: "12:20 PM"
            },
            {
                me: true,
                text:
                    "Absolutely! I can already see the headlines. Let's make it happen, Elon!",
                time: "12:25 PM"
            }
        ]
    },
    {
        id: 1,
        name: "Dwayne Johnson",
        image:
            "https://pbs.twimg.com/profile_images/3478244961/01ebfc40ecc194a2abc81e82ab877af4_400x400.jpeg",
        unread: 3,
        messages: [
            {
                me: true,
                text: "Hey Rock! Can you smell what I'm cooking?",
                time: "08:00 AM"
            },
            { me: false, text: "Haha! You got me! What's up?", time: "08:05 AM" },
            {
                me: true,
                text: "Just wanted to say hello to the People's Champion!",
                time: "08:10 AM"
            },
            {
                me: false,
                text: "Hello back to all the fans out there!",
                time: "08:15 AM"
            },
            {
                me: true,
                text: "You're the man, Rock! Keep inspiring!",
                time: "08:20 AM"
            }
        ]
    },
    {
        id: 2,
        name: "Ellen DeGeneres",
        image:
            "https://pbs.twimg.com/profile_images/1478120772044574724/v-dDUYb7_400x400.jpg",
        unread: 1,
        messages: [
            {
                me: false,
                text: "Hi Ellen! You always make me laugh. How do you do it?",
                time: "09:30 AM"
            },
            {
                me: true,
                text:
                    "It's all about dancing, kindness, and a little bit of mischief! 😉",
                time: "09:35 AM"
            },
            {
                me: false,
                text: "Haha! Your positivity is contagious. Keep spreading joy!",
                time: "09:40 AM"
            }
        ]
    },
    {
        id: 4,
        name: "Virat Kohli",
        image:
            "https://dpwishes.com/wp-content/uploads/2023/10/virat-kohli-dp-smiling-photo-virat-kohli.jpg",
        unread: 2,
        messages: [
            {
                me: true,
                text: "Hey Virat! How's it going on the cricket field?",
                time: "01:00 PM"
            },
            {
                me: false,
                text:
                    "Hey! It's been good. Just practicing the cover drive and all. How about you?",
                time: "01:05 PM"
            },
            {
                me: true,
                text:
                    "I'm just here, trying to hit home runs with imaginary flying Teslas. 😅",
                time: "01:10 PM"
            }
        ]
    },
    {
        id: 10,
        name: "Mukesh Ambani",
        image:
            "https://i.pinimg.com/474x/ae/d0/25/aed025d212b0732ae778bd7329d5e1d5.jpg",
        unread: 0,
        messages: [
            {
                me: true,
                text:
                    "Hello Mukesh! Your business empire is impressive. Any trade secrets to share?",
                time: "04:00 PM"
            },
            {
                me: false,
                text:
                    "Secret ingredient: a good cup of chai. The answer to all business problems! ☕",
                time: "04:05 PM"
            },
            {
                me: true,
                text:
                    "Chai power! I'll keep that in mind for my next business meeting.",
                time: "04:10 PM"
            }
        ]
    },
    {
        id: 5,
        name: "Priyanka Chopra",
        image:
            "https://pbs.twimg.com/profile_images/1366358223448514571/aWPlksSQ_400x400.jpg",
        unread: 1,
        messages: [
            {
                me: false,
                text:
                    "Hi Priyanka! Your latest movie was amazing. How do you manage to be so versatile?",
                time: "02:30 PM"
            },
            {
                me: true,
                text:
                    "Thank you! It's all about embracing every role and enjoying the process. What's your favorite movie?",
                time: "02:35 PM"
            }
        ]
    },
    {
        id: 14,
        name: "Jeff Bezos",
        image:
            "https://img.readthistwice.com/unsafe/640x640/persons/jeff-bezos.jpg",
        unread: 2,
        messages: [
            {
                me: true,
                text: "Hey Jeff! Amazon is amazing. How did you come up with the idea?",
                time: "02:30 PM"
            },
            {
                me: false,
                text:
                    "Glad you like it! Started as an online bookstore idea and evolved. Always focus on the customer!",
                time: "02:35 PM"
            },
            {
                me: true,
                text:
                    "Customer obsession, got it! Any tips for aspiring entrepreneurs?",
                time: "02:40 PM"
            },
            {
                me: false,
                text:
                    "Stay focused, take risks, and innovate. Oh, and enjoy the journey!",
                time: "02:45 PM"
            }
        ]
    },
    {
        id: 15,
        name: "Bill Gates",
        image:
            "https://media.gettyimages.com/id/1247163886/photo/london-england-microsoft-founder-bill-gates-reacts-during-a-visit-with-britains-prime.jpg?s=612x612&w=gi&k=20&c=w3UhMel1xoBLu8OijypVzwXMFLMzJwf9cngTlnL4Zlw=",
        unread: 1,
        messages: [
            {
                me: false,
                text:
                    "Hi Bill! Your work in tech and philanthropy is inspiring. What's your secret to success?",
                time: "03:15 PM"
            },
            {
                me: true,
                text:
                    "Continuous learning, embracing challenges, and giving back. Plus, a little bit of coding! 😄",
                time: "03:20 PM"
            },
            {
                me: false,
                text: "Coding is a superpower! Thanks for the advice, Bill.",
                time: "03:25 PM"
            }
        ]
    },
    {
        id: 18,
        name: "Donald Trump",
        image:
            "https://pbs.twimg.com/profile_images/736392853992001537/eF4LJLkn_400x400.jpg",
        unread: 2,
        messages: [
            {
                me: true,
                text:
                    "Hey Donald! Your tweets are legendary. How do you come up with such catchy phrases?",
                time: "06:00 PM"
            },
            {
                me: false,
                text:
                    "It's all about the art of the deal, my friend! I have the best words, believe me.",
                time: "06:05 PM"
            },
            {
                me: true,
                text: "The best words indeed! Any advice for negotiating with my cat?",
                time: "06:10 PM"
            },
            {
                me: false,
                text:
                    "Cats are tough negotiators. Offer them treats and build a wall of scratching posts. It's a win-win!",
                time: "06:15 PM"
            },
            {
                me: true,
                text:
                    "Great advice! I'll build a fortress of treats. Thanks, Mr. Trump!",
                time: "06:20 PM"
            },
            {
                me: false,
                text: "You're welcome! Make negotiations purrfect again!",
                time: "06:25 PM"
            }
        ]
    },
    {
        id: 19,
        name: "Sundar Pichai",
        image:
            "https://qph.cf2.quoracdn.net/main-qimg-d9d95d6982420e60b223a9909eb9fc53-lq",
        unread: 1,
        messages: [
            {
                me: false,
                text:
                    "Hi Sundar! Google is a part of my daily life. How do you manage such a vast empire?",
                time: "07:30 PM"
            },
            {
                me: true,
                text:
                    "With a little bit of search magic and a dash of machine learning. Keeps things interesting! 🚀",
                time: "07:35 PM"
            },
            {
                me: false,
                text: "Impressive! Can I Google how to be as successful as you?",
                time: "07:40 PM"
            },
            {
                me: true,
                text:
                    "You're welcome to try, but no guarantees on the search results! 😁",
                time: "07:45 PM"
            }
        ]
    }
];

const Chat = ({
    chats,
    selectedChat,
    setChats,
    setSelectedChat,
}) => {
    const navigate = useNavigate();

    const location = useLocation();
    const { roomId } = useParams();
    let [contact, setContact] = useState('')
    // const currentChat = chats.find(({ id }) => id === selectedChat);
    // const currentChat = chats.find(({ id }) => id === selectedChat);

    const className =
        "w-max max-w-[80%] py-1 px-1.5 rounded-lg shadow-md text-sm text-black flex items-end ";

    useEffect(() => {
        console.log(location.state)
        console.log(location.state.room)
        console.log(roomId)
        console.log(contact)
        setContact(location?.state?.room?.contact)
        // if (currentChat.unread) {
        //     setChats(
        //         chats.map((chat) => ({
        //             ...chat,
        //             unread: chat.id === selectedChat ? 0 : chat.unread
        //         }))
        //     );
        // }
    }, []);

    // useEffect(() => {
    //     if (currentChat.unread) {
    //         setChats(
    //             chats.map((chat) => ({
    //                 ...chat,
    //                 unread: chat.id === selectedChat ? 0 : chat.unread
    //             }))
    //         );
    //     }
    // }, []);

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
            return; // Prevent sending empty messages
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
                        <h4 className="font-medium font-bold">{contact.firstName}</h4>
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
                    {/* {currentChat.messages.map(({ text, me, time }, i) => (
                        <div
                            key={i}
                            className={`${me ? "bg-blue-400 ml-auto text-white" : "bg-white"
                                } ${className} ${text.length < 25 ? "flex-row gap-2  " : "flex-col"}`}
                        >
                            <p className="py-0.5 px-1.5 ">{text}</p>

                            <p className="text-xs ">
                                {time}

                            </p>
                        </div>
                    ))} */}
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

// const Chat = ({ roomId }) => {
//     const [messages, setMessages] = useState([]);
//     const [text, setText] = useState("");
//     const [isLoaded, setIsLoaded] = useState(false);
//     const [isAttachmentUploading, setIsAttachmentUploading] = useState(false);
//     const limitRef = useRef(15);
//     const [chats, setChats] = useState(defaultChats);
//     const [selectedTab, setSelectedTab] = useState("Chats");
//     const [selectedChat, setSelectedChat] = useState(null);
//     useEffect(() => {
//         const messagesQuery = query(
//             collection(db, "rooms", roomId, "messages"),
//             orderBy("createdAt", "desc"),
//             limit(limitRef.current)
//         );

//         const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//             const msgs = snapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setMessages(msgs.reverse());
//             setIsLoaded(true);
//         });

//         return () => unsubscribe();
//     }, [roomId]);

//     const handleSend = async () => {
//         if (text.trim() === "") return;

//         const newMessage = {
//             text,
//             createdAt: new Date(),
//             userId: auth.currentUser.uid,
//         };

//         await addDoc(collection(db, "rooms", roomId, "messages"), newMessage);
//         updateLastMessage(text);
//         setText("");
//     };

//     const handleImageSelection = async (file) => {
//         if (file) {
//             setIsAttachmentUploading(true);
//             const storageRef = ref(storage, `images/${file.name}`);
//             await uploadBytes(storageRef, file);
//             const uri = await getDownloadURL(storageRef);

//             const newMessage = {
//                 image: uri,
//                 createdAt: new Date(),
//                 userId: auth.currentUser.uid,
//             };

//             await addDoc(collection(db, "rooms", roomId, "messages"), newMessage);
//             updateLastMessage("Image");
//             setIsAttachmentUploading(false);
//         }
//     };

//     const updateLastMessage = async (text) => {
//         await updateDoc(doc(db, "rooms", roomId), {
//             lastMessage: text,
//         });
//     };

//     const loadMoreMessages = () => {
//         limitRef.current += 10;
//         // Trigger a re-fetch of messages with the new limit
//         setIsLoaded(false);
//     };
//     if (Boolean(selectedChat))
//         return (
//             <Chat
//                 chats={chats}
//                 selectedChat={selectedChat}
//                 setChats={setChats}
//                 setSelectedChat={setSelectedChat}
//             />
//         );

//     return (
//         <>
//             <Navbar />
//             <div className="container m-auto w-auto max-w-screen-lg min-w-min ">
//                 <Header
//                     selectedTab={selectedTab}
//                     setSelectedTab={setSelectedTab}
//                 />
//                 {selectedTab === "community" && <Contacts />}
//                 {/* {selectedTab === "Chats" && (
//                     <ChatsTab
//                         chats={chats}
//                         setSelectedChat={setSelectedChat}
//                     />
//                 )} */}
//             </div>

//         </>
//     );
//     return (
//         <div>
//             <h2>Chat Room</h2>
//             {isLoaded ? (
//                 <MessageList
//                     className="message-list"
//                     lockable={true}
//                     toBottomHeight={"100%"}
//                     dataSource={messages.map((msg) => ({
//                         position: msg.userId === auth.currentUser.uid ? "right" : "left",
//                         type: msg.image ? "photo" : "text",
//                         text: msg.text,
//                         date: msg.createdAt.toDate(),
//                         data: { uri: msg.image },
//                     }))}
//                 />
//             ) : (
//                 <p>Loading...</p>
//             )}
//             <ImagePicker
//                 extensions={['jpg', 'jpeg', 'png']}
//                 dims={{ minWidth: 100, maxWidth: 600, minHeight: 100, maxHeight: 600 }}
//                 onChange={handleImageSelection}
//                 onError={errMsg => console.log(errMsg)}
//             >
//                 <Button text="Select Image" disabled={isAttachmentUploading} />
//             </ImagePicker>
//             <Input
//                 placeholder="Type here..."
//                 multiline={true}
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 rightButtons={
//                     <Button
//                         text="Send"
//                         onClick={handleSend}
//                     />
//                 }
//             />
//             <button onClick={loadMoreMessages}>Load More Messages</button>
//         </div>
//     );
// };

export default Chat
