import React, { useState, useEffect } from "react";
import { auth, db, doc, getDoc } from "../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  MdMessage
} from "react-icons/md";


const Conversations = ({ chats, setSelectedChat, setIsCalling }) => {
  const [contacts, setContacts] = useState([]); 
  const [selectedProfile, setSelectedProfile] = useState(false);
  const [user, setuser] = useState((JSON.parse(localStorage.getItem('user'))))
  const [conversations, setConversations] = useState([]);
  const [userData, setUserData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  const getUser = async (id) => {
    // console.log(id)
    const userQuery = query(doc(db, "users", id))
    const userSnapshot = await getDoc(userQuery);
    // const userData = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("userSnapshot", userSnapshot.data());
    return { ...userSnapshot.data(), id: id };
  };


  const getRooms = async () => {
    try {
      const q = query(
        collection(db, "rooms"),
        where("userIds", "array-contains", user?.uid)
      );
      const querySnapshot = await getDocs(q);

      const fetchedConversations = await Promise.all(
        querySnapshot.docs.map(async doc => {
          let val = doc.data();
          val.contact = val.userIds.filter(x => x !== user.uid);

          // Fetch contact user details
          if (val.contact.length > 0) {
            val.contactUser = await getUser(val.contact[0]);
          } else {
            val.contactUser = null;
          }

          return val;
        })
        // .filter(e => e.contactUser?.id != user.uid)
        // .filter(e => {e.contactUser?.id != "8RxJqEffJUYs5Qh0a6XbU7fkhMg1"} )
      );
      // fetchedConversations = fetchedConversations.filter(e =>{ 
      //   console.log(e);
      //   return e.contactUser?.id != "8RxJqEffJUYs5Qh0a6XbU7fkhMg1"
      // })
    (fetchedConversations.filter(e =>{ 
        console.log(e);
        return e.contactUser?.id != "8RxJqEffJUYs5Qh0a6XbU7fkhMg1"
      }));
      setConversations(fetchedConversations);
      // console.log("all", querySnapshot);
      console.log("useruid", user.uid);
      console.log("fetchedConversations", fetchedConversations);
      // console.log("conversations-user",conversations)
    } catch (e) {
      console.error("Error fetching conversations: ", e);
    }
  };


  useEffect(() => {
    getRooms();
  }, []);


  const getRandomKey = () => {
    const key = Math.floor(Math.random() * 200000).toString();
    // console.log(key);
    return key;
  };


  const getRoom = async (roomId) => {
    // Fetch the room data and navigate to the chat page
    //
    try {
      const docRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const roomData = docSnap.data();
        navigate(`/chat/${roomId}`, { state: { room: roomData } });
      } else {
        console.log("No such room!");
      }
    } catch (e) {
      console.error("Error fetching room: ", e);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
};

const normalizedSearchTerm = searchTerm.trim().replace(/\s+/g, ' ').toLowerCase();

const filteredContacts = normalizedSearchTerm
    ? conversations.filter(chat =>
        chat?.contactUser?.firstName.toLowerCase().includes(normalizedSearchTerm)
      )
    : conversations;

  return (
    <>

      <section className="p-2">
        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg overflow-hidden border-2 mb-2">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokewidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange} 
            placeholder="Search something.." />
        </div>
        {filteredContacts.length === 0 ?(
          <div>
            <h1 className="text-4xl text-gray-400 font-bold">No Chats Found</h1>
          </div>
        ):(

        filteredContacts.map((chat) => (

          <div
            className="grid grid-cols-[3rem_1fr] items-center gap-3 px-5 py-4 hover:bg-gray-200 bg-neutral-100 rounded-lg m-1" 
            key={chat.id}
            onClick={() => getRoom(chat.id)}
          >
            <img
              className="rounded-full bg-gray-800 w-12 h-12 object-cover"
              src={chat?.contactUser?.imageUrl}
              onClick={(e) => {
                setSelectedProfile(chat);
                e.stopPropagation();
              }}
            />
            <div>
              <h4 className="text-gray-800 font-medium text-base flex justify-between">
                <span>{chat?.contactUser?.firstName}</span>
                { }
                {/* <span
                  className={`text-xs ${chat.unread.length ? "text-blue-400" : "text-black/50"
                    }`}
                >
                  {chat.messages[chat?.messages?.length - 1].time}
                </span> */}
              </h4>
              <p className="text-gray-500 font-thin text-base flex justify-between m-1 text-sm">
                <span>{chat?.lastMessage}</span>
              </p>

              <p className="text-sm text-black/60 flex justify-between">
                {/* <span className="line-clamp-1 text-start  w-[95%]">
                  {chat.messages[chat.messages.length - 1].text}
                </span>
                {chat.unread > 0 && (
                  <span className="bg-blue-400 text-white text-xs w-5 h-5 rounded-full inline-flex pt-0.5 items-center justify-center">
                    {chat.unread}
                  </span>
                )} */}
              </p>
            </div>
          </div>
        )))}

        <div className="fixed bottom-6 right-5 bg-primary p-4 rounded-2xl">
          <MdMessage className="text-2xl text-white" />
        </div>
      </section>
    </>
  );
};

export default Conversations;
