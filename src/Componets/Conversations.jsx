import React, { useState, useEffect } from "react";
import { db, doc, getDoc } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  MdMessage
} from "react-icons/md";


const Conversations = () => {
  const [selectedProfile, setSelectedProfile] = useState(false);
  const [user, setuser] = useState((JSON.parse(localStorage.getItem('user'))))
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  const getUser = async (id) => {
    const userQuery = query(doc(db, "users", id))
    const userSnapshot = await getDoc(userQuery);
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

          if (val.contact.length > 0) {
            val.contactUser = await getUser(val.contact[0]);
          } else {
            val.contactUser = null;
          }

          return val;
        })
      );
    (fetchedConversations.filter(e =>{ 
        console.log(e);
        return e.contactUser?.id != "8RxJqEffJUYs5Qh0a6XbU7fkhMg1"
      }));
      setConversations(fetchedConversations);
      console.log("useruid", user.uid);
      console.log("fetchedConversations", fetchedConversations);
    } catch (e) {
      console.error("Error fetching conversations: ", e);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);


  const getRoom = async (roomId) => {
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
              </h4>
              <p className="text-gray-500 font-thin text-base flex justify-between m-1 text-sm">
                <span>{chat?.lastMessage}</span>
              </p>

              <p className="text-sm text-black/60 flex justify-between">
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
