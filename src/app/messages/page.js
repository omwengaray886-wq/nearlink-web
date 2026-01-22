'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, query, where, onSnapshot, orderBy, 
  addDoc, serverTimestamp, updateDoc, doc, getDoc, limit 
} from 'firebase/firestore';
import { 
  Send, Search, MoreVertical, Phone, Video, 
  Info, Image as ImageIcon, Mic, Smile, ChevronLeft, Loader2,
  Check, CheckCheck, ArrowDown, Paperclip
} from 'lucide-react';

import Navbar from '@/components/Navbar';

// --- UTILS ---
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateSeparator = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp.seconds * 1000);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // --- STATE ---
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile toggle
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [otherUserProfiles, setOtherUserProfiles] = useState({}); // Cache profiles

  const scrollRef = useRef();
  const messagesContainerRef = useRef();

  // --- 1. PROTECT ROUTE ---
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // --- 2. LISTEN FOR CHATS (Sidebar) ---
  useEffect(() => {
    if (!user) return;

    // Filter chats where user is participant
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  // --- 3. RESOLVE OTHER USER PROFILES ---
  useEffect(() => {
    if (!user || chats.length === 0) return;

    chats.forEach(async (chat) => {
        // Find ID that is not mine
        const otherId = chat.participants.find(id => id !== user.uid);
        if (otherId && !otherUserProfiles[otherId]) {
            // Check if profile exists in metadata, else fetch (simulated fetch here)
            // In a real app, fetch from 'users' collection if not in cache
            if(chat.metaData && chat.metaData[otherId]){
                 setOtherUserProfiles(prev => ({...prev, [otherId]: chat.metaData[otherId]}));
            } else {
                 // Fallback Fetch from Users Collection (Real app logic)
                 try {
                    const userSnap = await getDoc(doc(db, "users", otherId));
                    if (userSnap.exists()) {
                        setOtherUserProfiles(prev => ({...prev, [otherId]: userSnap.data()}));
                    }
                 } catch(e) { console.log("Profile fetch error", e); }
            }
        }
    });
  }, [chats, user]);

  // --- 4. LISTEN FOR MESSAGES (Active Chat) ---
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, 'chats', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      scrollToBottom();
    });

    // Mobile Logic: Hide sidebar when chat opens
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    return () => unsubscribe();
  }, [activeChat]);

  // Scroll Handler
  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
  };

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
        read: false
      });

      // 2. Update Chat Metadata
      await updateDoc(doc(db, 'chats', activeChat.id), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        [`unread.${activeChat.otherUser?.uid}`]: true 
      });

    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  // --- RENDER HELPERS ---
  const getOtherUser = (chat) => {
      if(!user) return null;
      const otherId = chat.participants.find(id => id !== user.uid);
      return otherUserProfiles[otherId] || { name: "Loading...", avatar: "" }; // Fallback
  };

  // Group messages logic (Memoized)
  const groupedMessages = useMemo(() => {
      let groups = [];
      let lastDate = null;

      messages.forEach((msg, i) => {
          const date = formatDateSeparator(msg.createdAt);
          if (date !== lastDate) {
              groups.push({ type: 'date', date });
              lastDate = date;
          }
          groups.push({ type: 'message', ...msg });
      });
      return groups;
  }, [messages]);


  if (loading || !user) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-nearlink w-10 h-10"/></div>;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 shrink-0 z-20"><Navbar /></div>

      <div className="flex-1 max-w-[1920px] mx-auto w-full flex overflow-hidden relative">
        
        {/* --- SIDEBAR (Chat List) --- */}
        <div className={`
            absolute inset-0 z-10 bg-white md:relative md:w-80 lg:w-96 border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="font-black text-xl text-gray-900 tracking-tight">Messages</h2>
                <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"><MoreVertical size={20} className="text-gray-600"/></button>
            </div>
            
            {/* Search */}
            <div className="p-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nearlink transition" size={18}/>
                    <input type="text" placeholder="Search conversations" className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-nearlink/20 transition"/>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chats.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-nearlink"><Info size={28}/></div>
                        <p className="font-bold text-gray-900 mb-1">No messages yet</p>
                        <p className="text-xs text-gray-500">Connect with a host to start chatting.</p>
                    </div>
                ) : (
                    chats.map(chat => {
                        const otherUser = getOtherUser(chat);
                        const isActive = activeChat?.id === chat.id;
                        return (
                            <div 
                                key={chat.id} 
                                onClick={() => { setActiveChat(chat); setIsSidebarOpen(false); }}
                                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-all border-l-4 ${isActive ? 'border-nearlink bg-blue-50/30' : 'border-transparent'}`}
                            >
                                <div className="relative">
                                    <img src={otherUser.avatar || "https://github.com/shadcn.png"} className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"/>
                                    {/* Online Indicator (Mock) */}
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`font-bold truncate ${isActive ? 'text-nearlink' : 'text-gray-900'}`}>{otherUser.name}</h4>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm truncate max-w-[180px] ${isActive ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                                            {chat.lastSenderId === user.uid && <span className="text-xs mr-1">You:</span>} 
                                            {chat.lastMessage}
                                        </p>
                                        {/* Unread Badge (Mock logic) */}
                                        {/* {chat.unreadCount > 0 && <span className="bg-nearlink text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>} */}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        {/* --- MAIN CHAT AREA --- */}
        <div className={`flex-1 flex flex-col bg-[#F3F4F6] relative transition-opacity duration-300 ${!isSidebarOpen || activeChat ? 'opacity-100 z-0' : 'opacity-0 md:opacity-100 -z-10'}`}>
            
            {activeChat ? (
                <>
                    {/* Header */}
                    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"><ChevronLeft/></button>
                            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
                                <div className="relative">
                                    <img src={getOtherUser(activeChat).avatar || "https://github.com/shadcn.png"} className="w-10 h-10 rounded-full object-cover shadow-sm"/>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{getOtherUser(activeChat).name}</h3>
                                    <p className="text-xs text-green-600 font-bold">Online Now</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 text-gray-400">
                            <button className="p-2 hover:bg-gray-100 rounded-full hover:text-nearlink transition"><Phone size={20}/></button>
                            <button className="p-2 hover:bg-gray-100 rounded-full hover:text-nearlink transition"><Video size={20}/></button>
                            <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>
                            <button className="p-2 hover:bg-gray-100 rounded-full hover:text-gray-900 transition"><Info size={20}/></button>
                        </div>
                    </div>

                    {/* Messages Feed */}
                    <div 
                        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'soft-light' }} // Subtle pattern
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                    >
                        {groupedMessages.map((item, i) => {
                            if (item.type === 'date') {
                                return (
                                    <div key={`date-${i}`} className="flex justify-center my-6">
                                        <span className="bg-gray-200/80 backdrop-blur-sm text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                            {item.date}
                                        </span>
                                    </div>
                                );
                            }

                            const isMe = item.senderId === user.uid;
                            // Check if next message is from same sender (for grouping visuals)
                            const isNextSame = groupedMessages[i+1]?.senderId === item.senderId;

                            return (
                                <div key={item.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-1`}>
                                    {/* Avatar for receiver (only show on last message of group) */}
                                    {!isMe && (
                                        <div className={`w-8 mr-2 flex flex-col justify-end ${isNextSame ? 'opacity-0' : 'opacity-100'}`}>
                                            <img src={getOtherUser(activeChat).avatar || "https://github.com/shadcn.png"} className="w-8 h-8 rounded-full object-cover"/>
                                        </div>
                                    )}

                                    <div className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 rounded-2xl shadow-sm relative text-[15px] leading-relaxed transition-all 
                                        ${isMe 
                                            ? 'bg-black text-white rounded-br-none' 
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        }
                                    `}>
                                        {item.text}
                                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 select-none ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                            {formatTime(item.createdAt)}
                                            {isMe && <CheckCheck size={12} className={item.read ? "text-blue-400" : ""}/>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={scrollRef}></div>
                    </div>

                    {/* Scroll to Bottom Button */}
                    {showScrollBottom && (
                        <button 
                            onClick={scrollToBottom}
                            className="absolute bottom-24 right-8 bg-white p-2 rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-nearlink hover:-translate-y-1 transition animate-in fade-in zoom-in"
                        >
                            <ArrowDown size={20}/>
                        </button>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-end gap-2 bg-gray-50 p-2 rounded-3xl border border-gray-200 focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-md transition-all duration-200">
                            <button type="button" className="p-3 text-gray-400 hover:text-nearlink hover:bg-gray-100 rounded-full transition"><Paperclip size={20}/></button>
                            <div className="flex-1 py-3">
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..." 
                                    className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder-gray-400"
                                />
                            </div>
                            {newMessage.trim() ? (
                                <button type="submit" className="p-3 bg-black text-white rounded-full hover:scale-105 active:scale-95 transition shadow-lg">
                                    <Send size={18} className="ml-0.5"/>
                                </button>
                            ) : (
                                <>
                                    <button type="button" className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"><ImageIcon size={20}/></button>
                                    <button type="button" className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"><Mic size={20}/></button>
                                </>
                            )}
                        </form>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-gray-400">Press Enter to send</p>
                        </div>
                    </div>

                </>
            ) : (
                /* Empty State (No Chat Active) */
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50/50 text-center p-8">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-gray-100 animate-in zoom-in duration-500">
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            <Send size={64} className="ml-2"/>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Your Messages</h2>
                    <p className="text-gray-500 max-w-sm text-lg leading-relaxed">Select a conversation from the sidebar to start chatting with hosts or guests.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}