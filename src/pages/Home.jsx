import { useState, useRef } from 'react';
import SideBar from '@/components/SideBar';
import Chats from '@/components/Chats';
import SideBarCompact from '@/components/SideBarCompact';
import AuthModal from '@/components/AuthModal';
const Home = (
    {
        handleNewChat,
        handleChatSelect,
        handleDeleteChat,
        chats,
        currentChatID,
        messages,
        setMessages,
        input,
        setInput,
        isLoading,
        setIsLoading,
        handleSendMessage,
        isBlocked,
        isAuth,
        messageCount
    }
) => {
    // CONSTANTES PARA MANEJAR EL ESTADO DE LOS SIDEBAR
    const [isCompact, setIsCompact] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // CONSTANTE PARA MANEJAR EL ESTADO DEL SEARCHMENU
    const [isMenuSearchOpen, setIsMenuSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const searchRef = useRef(null);

    return (
        <div className="flex h-screen">
            {!isAuth && messageCount >= 3 && (
                <AuthModal />
            )}
            {/* ESCRITORIO */}
            <div className='hidden md:block'>
                {isCompact ? (
                    <SideBarCompact
                        onExpand={() => setIsCompact(false)}
                        onNewChat={handleNewChat}
                        onMenuSearchOpen={() => setIsMenuSearchOpen(true)}
                        onMenuSearchClose={() => setIsMenuSearchOpen(false)}
                        isMenuSearchOpen={isMenuSearchOpen}
                        setIsMenuSearchOpen={setIsMenuSearchOpen}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onChatSelect={handleChatSelect}
                        onDeleteChat={handleDeleteChat}
                        chats={chats}
                        searchRef={searchRef}
                    />
                ) : (
                    <SideBar
                        onCollapse={() => setIsCompact(true)}
                        chats={chats}
                        currentChatID={currentChatID}
                        onNewChat={handleNewChat}
                        onChatSelect={handleChatSelect}
                        onDeleteChat={handleDeleteChat}
                        onMenuSearchOpen={() => setIsMenuSearchOpen(true)}
                        onMenuSearchClose={() => setIsMenuSearchOpen(false)}
                        isMenuSearchOpen={isMenuSearchOpen}
                        setIsMenuSearchOpen={setIsMenuSearchOpen}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchRef={searchRef}
                        setIsMobileOpen={setIsMobileOpen}
                        className="hidden md:flex"
                    />
                )}

            </div>

            {/* MÓVIL */}
            <div className="block md:hidden">
                {isMobileOpen && (
                    <div className='fixed inset-0 z-20 flex'>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50"
                            onClick={() => setIsMobileOpen(false)}>
                        </div>
                        <div className='relative z-30 w-64 h-full bg-gray-800'>
                            <SideBar
                                onClose={() => setIsMobileOpen(false)}
                                setIsMobileOpen={setIsMobileOpen}
                                chats={chats}
                                currentChatID={currentChatID}
                                onNewChat={handleNewChat}
                                onChatSelect={handleChatSelect}
                                onDeleteChat={handleDeleteChat}
                                onMenuSearchOpen={() => setIsMenuSearchOpen(true)}
                                onMenuSearchClose={() => setIsMenuSearchOpen(false)}
                                isMenuSearchOpen={isMenuSearchOpen}
                                setIsMenuSearchOpen={setIsMenuSearchOpen}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                searchRef={searchRef}
                            />
                        </div>
                    </div>
                )}
            </div>
            <Chats
                messages={messages}
                setMessages={setMessages}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleSendMessage={handleSendMessage}
                onOpenMenu={() => setIsMobileOpen(true)}
                isBlocked={isBlocked}
            />
        </div>
    )
}

export default Home
