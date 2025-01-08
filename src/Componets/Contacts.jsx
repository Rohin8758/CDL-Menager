import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Contacts = () => {

    const [contacts, setContacts] = useState([]);
    const [user, setuser] = useState((JSON.parse(localStorage.getItem('user'))))
    const [companyId, setCompanyId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            let userData = localStorage.getItem(user)
            if (userData) setuser(JSON.parse(userData))
        }
        setCompanyId(user.companyId)

        const fetchusers = async () => {
            try {
                let users = await getDocs(query(collection(db, "users"),
                    where("companyId", "==", user.companyId),
                ));

                let userData = users.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((doc) => doc.id != user.uid)

                setContacts(userData)
            } catch (error) {
                console.error("Error getting companies:", error);
            }
        };
        fetchusers();
    }, [user]);

    const handleChat = async (contact) => {

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error('User not authenticated.');
                return;
            }

            const qry = query(
                collection(db, "rooms"),
                where("userIds", "array-contains", user.uid)
            );


            const querySnapshot = await getDocs(qry);

            let chatRoom = null;
            querySnapshot.forEach((doc) => {
                const chatRoomData = doc.data();
                if (chatRoomData.userIds.includes(contact.id)) {
                    chatRoom = { id: doc.id, ...chatRoomData };
                }
            });

            if (!chatRoom) {
                const room = {
                    userIds: [currentUser.uid, contact.id],
                    name: contact.firstName, 
                    type: "direct",
                    lastMessage: '',
                    createdAt: new Date(),
                    metadata: null
                };

                const newChatRoomRef = await addDoc(collection(db, "rooms"), room);
                chatRoom = { id: newChatRoomRef.id, ...room };
            }

            let finalData = { ...chatRoom, contact }
            navigate(`/chat/${chatRoom.id}`, { state: { room: finalData } });

        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const normalizedSearchTerm = searchTerm.trim().replace(/\s+/g, ' ').toLowerCase();

    const filteredContacts = normalizedSearchTerm
        ? contacts.filter(contact =>
            contact.firstName.toLowerCase().includes(normalizedSearchTerm)
        )
        : contacts;

    return (
        <div className="p-2">
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
            <section className="text-center">
        
                {filteredContacts.length === 0 ? (
                <div>
                   <h1 className="text-4xl text-gray-400 font-bold">No Contacts Found</h1>
                 </div>
               ):(

                filteredContacts.map(contact => (
                    <div onClick={() => handleChat(contact)} key={contact?.id}
                        className="grid grid-cols-[3rem_1fr] items-center gap-3 px-5 py-4 hover:bg-gray-200 bg-neutral-100 rounded-lg m-1">
                        <img
                            className="rounded-full bg-gray-800 w-12 h-12 object-cover"
                            src={contact.imageUrl} />
                        <div>
                            <h4 className="text-gray-800 font-medium text-base flex justify-between">
                                <span>{contact.firstName} </span>
                            </h4>
                            <p className="text-sm text-black/60 flex justify-between">
                                <span className="line-clamp-1 text-start  w-[95%]">
                                    {contact.role}
                                </span>
                            </p>
                        </div>
                    </div>
                )))}
            </section>
        </div>
    );
};

export default Contacts;
