'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, query, where, onSnapshot, orderBy, 
  addDoc, serverTimestamp, updateDoc, doc, getDoc 
} from 'firebase/firestore';
import { 
  Send, Search, MoreVertical, Phone, Video, 
  Info, Image as ImageIcon, Mic, Smile, ChevronLeft, Loader2
} from 'lucide-react';

import Navbar from '../../components/Navbar';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // --- STATE ---
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile toggle
  const scrollRef = useRef();

  // --- 1. PROTECT ROUTE ---
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // --- 2. LISTEN FOR CHATS (Sidebar) ---
  useEffect(() => {
    if (!user) return;

    // Query: Chats where current user is a participant
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => {
        const data = doc.data();
        // Determine the "Other User" (Guest or Host)
        // In a real app, you'd verify the ID against a 'users' collection to get name/avatar
        // For now, we rely on metadata stored in the chat document
        const otherUser = data.metaData?.[user.uid === data.hostId ? data.guestId : data.hostId] || { name: "User", avatar: "" };
        
        return { id: doc.id, ...data, otherUser };
      });
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  // --- 3. LISTEN FOR MESSAGES (Active Chat) ---
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, 'chats', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      // Scroll to bottom
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    // Mark as read (optional logic here)
    
    // Close sidebar on mobile when chat opens
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    return () => unsubscribe();
  }, [activeChat]);

  // --- HANDLERS ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user) return;

    const text = newMessage;
    setNewMessage(''); // Instant UI clear

    try {
      // 1. Add Message to Subcollection
      await addDoc(collection(db, 'chats', activeChat.id, 'messages'), {
        text,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });

      // 2. Update Chat Metadata (Last Message)
      await updateDoc(doc(db, 'chats', activeChat.id), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        [`unread.${activeChat.otherUser.uid}`]: true // Flag unread for other user (if logic exists)
      });

    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  const createSupportChat = async () => {
    // Demo function to create a chat if list is empty
    if(!user) return;
    try {
        await addDoc(collection(db, 'chats'), {
            participants: [user.uid, 'SUPPORT_BOT'],
            hostId: 'SUPPORT_BOT',
            guestId: user.uid,
            lastMessage: "Welcome to NearLink Support!",
            lastMessageTime: serverTimestamp(),
            metaData: {
                [user.uid]: { name: user.name, avatar: user.image },
                'SUPPORT_BOT': { name: "NearLink Support", avatar: "https://github.com/shadcn.png" }
            }
        });
    } catch(e) { console.error(e); }
  }

  if (loading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 shrink-0"><Navbar /></div>

      <div className="flex-1 max-w-[1920px] mx-auto w-full flex overflow-hidden">
        
        {/* --- SIDEBAR (Chat List) --- */}
        <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-xl">Messages</h2>
                <div className="bg-gray-100 p-2 rounded-full"><MoreVertical size={20} className="text-gray-500"/></div>
            </div>
            
            {/* Search */}
            <div className="p-4 pt-0 mt-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <input type="text" placeholder="Search inbox" className="w-full bg-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/5"/>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500"><MessageSquare size={24}/></div>
                        <p className="font-bold text-gray-900 mb-1">No messages yet</p>
                        <p className="text-xs text-gray-500 mb-4">When you contact a host, it will appear here.</p>
                        <button onClick={createSupportChat} className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg">Start Support Chat</button>
                    </div>
                ) : (
                    chats.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChat(chat)}
                            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition border-l-4 ${activeChat?.id === chat.id ? 'border-nearlink bg-gray-50' : 'border-transparent'}`}
                        >
                            <img src={chat.otherUser?.avatar || "https://github.com/shadcn.png"} className="w-12 h-12 rounded-full object-cover border border-gray-200"/>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-gray-900 truncate">{chat.otherUser?.name || "User"}</h4>
                                    <span className="text-[10px] text-gray-400">
                                        {chat.lastMessageTime?.seconds ? new Date(chat.lastMessageTime.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* --- MAIN CHAT AREA --- */}
        {activeChat ? (
            <div className={`flex-1 flex flex-col bg-white ${isSidebarOpen ? 'hidden md:flex' : 'flex'}`}>
                
                {/* Chat Header */}
                <div className="h-20 border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><ChevronLeft/></button>
                        <div className="relative">
                            <img src={activeChat.otherUser?.avatar || "https://github.com/shadcn.png"} className="w-10 h-10 rounded-full object-cover"/>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{activeChat.otherUser?.name}</h3>
                            <p className="text-xs text-green-600 font-medium">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <Phone size={20} className="hover:text-black cursor-pointer transition"/>
                        <Video size={20} className="hover:text-black cursor-pointer transition"/>
                        <Info size={20} className="hover:text-black cursor-pointer transition"/>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8F9FA]">
                    {messages.map((msg, i) => {
                        const isMe = msg.senderId === user.uid;
                        return (
                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    isMe 
                                    ? 'bg-black text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                    <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-gray-400' : 'text-gray-300'}`}>
                                        {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef}></div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition">
                        <button type="button" className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition"><Plus size={20}/></button>
                        <input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 bg-transparent outline-none text-sm font-medium px-2"
                        />
                        <button type="button" className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-full transition"><Smile size={20}/></button>
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="p-3 bg-nearlink text-black rounded-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} className="ml-0.5"/>
                        </button>
                    </form>
                </div>

            </div>
        ) : (
            // Empty State (No Chat Selected)
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 text-center p-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <MessageSquare size={64} className="text-gray-400"/>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Your Messages</h2>
                <p className="text-gray-500 max-w-sm">Select a conversation from the sidebar to start chatting with hosts or guests.</p>
            </div>
        )}

      </div>
    </div>
  );
}