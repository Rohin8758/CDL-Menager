import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, getDocs, updateDoc, doc, setDoc, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Contacts = () => {

    const [contacts, setContacts] = useState([]);
    const [user, setuser] = useState((JSON.parse(localStorage.getItem('user'))))
    const [companyId, setCompanyId] = useState("");
    const [userdata, setUsersdata] = useState([]);
    const [imageUrl, setimageUrl] = useState([]);
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
                // console.log(role);
                // setUsersdata(users);
            } catch (error) {
                console.error("Error getting companies:", error);
            }
        };
        fetchusers();
    }, [user]);

    // const handleChat = (user) => {
    //     console.log("Clicked user:", user.id);

    //     // try {

    //     //     const currentUser = auth.currentUser.uid;

    //     //     // Query to check if a chat room already exists between the two users
    //     //     const roomsQuery = query(
    //     //         collection(db, "rooms"),
    //     //         where("users", "array-contains", currentUser)
    //     //     );
    //     //     const roomsSnapshot = await getDocs(roomsQuery);
    //     //     let existingRoom = null;

    //     //     roomsSnapshot.forEach((roomDoc) => {
    //     //         const roomData = roomDoc.data();
    //     //         if (roomData.users.includes(user.uid)) {
    //     //             existingRoom = roomDoc;
    //     //         }
    //     //     });

    //     //     if (existingRoom) {
    //     //         // Room already exists, navigate to the existing room
    //     //         navigate(`/chat/${existingRoom.id}`, { state: { room: existingRoom.data(), firstName: user.firstName } });
    //     //     } else {
    //     //         // No existing room, create a new one
    //     //         const roomId = uuidv4();
    //     //         const room = {
    //     //             id: roomId,
    //     //             users: [currentUser, user.uid],
    //     //             name: user.firstName,
    //     //             imageUrl: user.imageUrl,
    //     //             lastMessage: "",
    //     //             createdAt: new Date()
    //     //         };

    //     //         await setDoc(doc(db, "rooms", roomId), room);
    //     //         navigate(`/chat/${roomId}`, { state: { room, firstName: user.firstName } });
    //     //     }
    //     // } catch (error) {
    //     //     console.error("Error creating or finding chat room: ", error);
    //     // }
    // };

    const handleChat = async (contact) => {
        // console.log("Clicked user:", contact.id);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error('User not authenticated.');
                return;
            }

            // Query to check if chat room exists
            const qry = query(
                collection(db, "rooms"),
                where("userIds", "array-contains", user.uid)
            );


            const querySnapshot = await getDocs(qry);

            let chatRoom = null;
            querySnapshot.forEach((doc) => {
                const chatRoomData = doc.data();
                console.log(chatRoomData, "chatRoomData")
                console.log(chatRoomData.userIds.includes(contact.id))
                if (chatRoomData.userIds.includes(contact.id)) {
                    console.log(123)
                    chatRoom = { id: doc.id, ...chatRoomData };
                }
            });

            //if chat room not exist then create new chat room
            if (!chatRoom) {
                const room = {
                    userIds: [currentUser.uid, contact.id],
                    name: contact.firstName, // Adjust based on your user structure
                    // imageUrl: user.imageUrl, // Adjust based on your user structure
                    type: "direct",
                    lastMessage: '',
                    createdAt: new Date(),
                    metadata: null
                };

                const newChatRoomRef = await addDoc(collection(db, "rooms"), room);
                chatRoom = { id: newChatRoomRef.id, ...room };
            }

            // Navigate to the chat room with roomId
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
            {/*<div id="main" class="container mt-5">
                <div class="searchable-container">
                    <input type="text" class="form-control form-control-lg mb-2" id="search-input" placeholder="Search..." />
                    <div class="error-message mb-2" id="error-message">No results found.</div>
                    <select class="form-select" id="searchable-select" size="8">
                    </select>
                </div>
            </div>*/}
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
