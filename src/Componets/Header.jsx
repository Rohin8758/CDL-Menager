import React from 'react'
import { IoIosPeople } from 'react-icons/io';

const Header = ({ selectedTab, setSelectedTab }) => {
    const tabs = ["Chats"];
    return (
        <header className=" bg-primary text-white bg-blue-400 sticky top-0 ">
            <nav className="grid grid-cols-[1fr_2fr_2fr_2fr] text-center">
                <p
                    onClick={() => setSelectedTab("community")}
                    className={`flex justify-center font-medium py-1.5 border-b-4 hover:bg-black/10 ${selectedTab === "community"
                        ? "border-white"
                        : "border-transparent text-white/70"
                        }`}
                >
                    <IoIosPeople className="text-2xl" />
                </p>

                {tabs.map((tab) => (
                    <p
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`flex justify-center font-medium py-1.5 border-b-4 hover:bg-black/10 ${selectedTab === tab
                            ? "border-white"
                            : "border-transparent text-white/70"
                            }`}
                    >
                        {tab}
                    </p>
                ))}
            </nav>

        </header>
    );
};


export default Header