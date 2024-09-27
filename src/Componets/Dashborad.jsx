import React, {
    useState,
    useEffect
} from "react";
import { IoIosPeople, IoMdSend } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import {
    MdMessage
} from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Chat from "./Chat";
import Header from "./Header";
import { auth, db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { collection, query, where, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import Contacts from "./Contacts";
import Conversations from "./Conversations";

const defaultChats = [
    {
        id: 3,
        name: "Elon Musk..",
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


export default function Wapp() {
    const [chats, setChats] = useState(defaultChats);
    const [selectedTab, setSelectedTab] = useState("Chats");
    const [selectedChat, setSelectedChat] = useState(null);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // const user = auth.currentUser;
        // if (user) {
        // Navigate("/dashborad");
        // } else {
        // Navigate("/dashborad");

        // }

        // const user = localStorage.getItem('isLoggedIn');

        // if (user) {
        //     setIsLoggedIn(true);
        //     Navigate("/dashborad");

        // } else {
        //     setIsLoggedIn(false);
        // }
    }, []);

    // useEffect(() => {
    //     let x = localStorage.getItem("isLoggedIn");
    //     if (!x) {
    //        Navigate("/");  
    //     }
    // }, [])

    if (Boolean(selectedChat))
        return (
            <Chat
                chats={chats}
                selectedChat={selectedChat}
                setChats={setChats}
                setSelectedChat={setSelectedChat}
            />
        );

    return (
        <>
            <Navbar />
            <div className="container m-auto w-auto max-w-screen-lg min-w-min ">
                <Header
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                />
                {selectedTab === "community" && <Contacts />}
                {selectedTab === "Chats" && (
                    <Conversations
                        chats={chats}
                        setSelectedChat={setSelectedChat}
                    />
                )}
            </div>

        </>
    );
}


