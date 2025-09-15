import SideBar from '@/components/SideBar';
import Chats from '@/components/Chats';
import SideBarCompact from '@/components/SideBarCompact';
import AuthModal from '@/components/AuthModal';
import { useChatContext } from '@/hooks/useChatContext';
const Home = () => {

    const {
        isCompact,
        setIsCompact,
        isMobileOpen,
        setIsMobileOpen,
        setIsMenuSearchOpen,
        isBlocked,
    } = useChatContext();

    return (
        <div className="flex h-screen">
            {isBlocked && <AuthModal />}
            {/* ESCRITORIO */}
            <div className='hidden md:block'>
                {isCompact ? (
                    <SideBarCompact
                        onExpand={() => setIsCompact(false)}
                        onMenuSearchOpen={() => setIsMenuSearchOpen(true)}
                        onMenuSearchClose={() => setIsMenuSearchOpen(false)}
                    />
                ) : (
                    <SideBar
                        onCollapse={() => setIsCompact(true)}
                        onMenuSearchOpen={() => setIsMenuSearchOpen(true)}
                        onMenuSearchClose={() => setIsMenuSearchOpen(false)}
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
                                onMenuSearchOpen={() => setIsMenuSearchOpen(true)}
                                onMenuSearchClose={() => setIsMenuSearchOpen(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
            <Chats
                onOpenMenu={() => setIsMobileOpen(true)}
            />
        </div>
    )
}

export default Home
