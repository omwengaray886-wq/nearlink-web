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
  Check, CheckCheck, ArrowDown, Paperclip, MoreHorizontal
} from 'lucide-react';

import Navbar from '@/components/Navbar';

// --- UTILS (Unchanged) ---
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
  
  // --- STATE (Unchanged) ---
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [otherUserProfiles, setOtherUserProfiles] = useState({}); 

  const scrollRef = useRef();
  const messagesContainerRef = useRef();

  // --- LOGIC HOOKS (Unchanged) ---
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
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

  useEffect(() => {
    if (!user || chats.length === 0) return;
    chats.forEach(async (chat) => {
        const otherId = chat.participants.find(id => id !== user.uid);
        if (otherId && !otherUserProfiles[otherId]) {
            if(chat.metaData && chat.metaData[otherId]){
                 setOtherUserProfiles(prev => ({...prev, [otherId]: chat.metaData[otherId]}));
            } else {
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
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    return () => unsubscribe();
  }, [activeChat]);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user) return;

    const text = newMessage;
    setNewMessage(''); 

    try {
      await addDoc(collection(db, 'chats', activeChat.id, 'messages'), {
        text,
        senderId: user.uid,
        createdAt: serverTimestamp(),
        read: false
      });
      await updateDoc(doc(db, 'chats', activeChat.id), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        [`unread.${activeChat.otherUser?.uid}`]: true 
      });
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  const getOtherUser = (chat) => {
      if(!user) return null;
      const otherId = chat.participants.find(id => id !== user.uid);
      return otherUserProfiles[otherId] || { name: "Loading...", avatar: "" };
  };

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


  if (loading || !user) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600 w-10 h-10"/></div>;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-900">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 shrink-0 z-30 sticky top-0"><Navbar /></div>

      <div className="flex-1 max-w-[1920px] mx-auto w-full flex overflow-hidden relative shadow-2xl my-0 md:my-4 md:mx-4 md:rounded-2xl md:h-[calc(100vh-100px)] border border-slate-200 bg-white">
        
        {/* --- SIDEBAR (Refined) --- */}
        <div className={`
            absolute inset-0 z-20 bg-white md:relative md:w-80 lg:w-[400px] border-r border-slate-100 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Sidebar Header */}
            <div className="p-5 flex justify-between items-center bg-white/50 backdrop-blur-sm z-10">
                <h2 className="font-bold text-2xl text-slate-800 tracking-tight">Chats</h2>
                <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"><MoreHorizontal size={20}/></button>
                </div>
            </div>
            
            {/* Search - Modernized */}
            <div className="px-5 pb-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* List - Clean & Spaced */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-1">
                {chats.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Info size={24} className="text-slate-400"/></div>
                        <p className="font-semibold text-slate-700">No conversations</p>
                    </div>
                ) : (
                    chats.map(chat => {
                        const otherUser = getOtherUser(chat);
                        const isActive = activeChat?.id === chat.id;
                        return (
                            <div 
                                key={chat.id} 
                                onClick={() => { setActiveChat(chat); setIsSidebarOpen(false); }}
                                className={`
                                    relative flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all duration-200 group
                                    ${isActive ? 'bg-indigo-50/80 shadow-sm' : 'hover:bg-slate-50'}
                                `}
                            >
                                <div className="relative shrink-0">
                                    <img src={otherUser.avatar || "https://github.com/shadcn.png"} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"/>
                                    {/* Mock Online Status */}
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-white rounded-full"></span>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className={`font-semibold truncate text-[15px] ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                                            {otherUser.name}
                                        </h4>
                                        <span className={`text-[11px] font-medium ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-[13px] truncate max-w-[200px] leading-relaxed ${isActive ? 'text-indigo-700/80 font-medium' : 'text-slate-500 group-hover:text-slate-600'}`}>
                                            {chat.lastSenderId === user.uid && <span className="mr-1 opacity-70">You:</span>} 
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        {/* --- MAIN CHAT AREA --- */}
        <div className={`flex-1 flex flex-col bg-[#FAFAFA] relative transition-opacity duration-300 ${!isSidebarOpen || activeChat ? 'opacity-100 z-0' : 'opacity-0 md:opacity-100 -z-10'}`}>
            
            {activeChat ? (
                <>
                    {/* Chat Header */}
                    <div className="h-[76px] bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-20 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><ChevronLeft/></button>
                            
                            <div className="flex items-center gap-3.5 cursor-pointer group">
                                <div className="relative">
                                    <img src={getOtherUser(activeChat).avatar || "https://github.com/shadcn.png"} className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-indigo-100 transition-all"/>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-[15px] leading-tight group-hover:text-indigo-600 transition-colors">{getOtherUser(activeChat).name}</h3>
                                    <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        Active now
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 md:gap-3 text-slate-400">
                            <button className="p-2.5 hover:bg-indigo-50 rounded-full hover:text-indigo-600 transition-all active:scale-95"><Phone size={18}/></button>
                            <button className="p-2.5 hover:bg-indigo-50 rounded-full hover:text-indigo-600 transition-all active:scale-95"><Video size={19}/></button>
                            <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>
                            <button className="p-2.5 hover:bg-slate-100 rounded-full hover:text-slate-700 transition-all active:scale-95"><MoreVertical size={18}/></button>
                        </div>
                    </div>

                    {/* Messages Feed */}
                    <div 
                        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
                        // Subtle geometric pattern
                        style={{ 
                            backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', 
                            backgroundSize: '40px 40px' 
                        }}
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                    >
                        {groupedMessages.map((item, i) => {
                            if (item.type === 'date') {
                                return (
                                    <div key={`date-${i}`} className="flex justify-center sticky top-2 z-10 opacity-90 hover:opacity-100 transition-opacity">
                                        <span className="bg-slate-200/60 backdrop-blur-md text-slate-600 text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wide border border-white/20">
                                            {item.date}
                                        </span>
                                    </div>
                                );
                            }

                            const isMe = item.senderId === user.uid;
                            const isNextSame = groupedMessages[i+1]?.senderId === item.senderId;
                            const isPrevSame = groupedMessages[i-1]?.senderId === item.senderId;

                            return (
                                <div key={item.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    {/* Avatar (Receiver) */}
                                    {!isMe && (
                                        <div className={`w-9 mr-3 flex flex-col justify-end ${isNextSame ? 'invisible' : ''}`}>
                                            <img src={getOtherUser(activeChat).avatar || "https://github.com/shadcn.png"} className="w-9 h-9 rounded-full object-cover shadow-sm"/>
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] md:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div 
                                            className={`
                                                px-5 py-3 shadow-sm text-[15px] leading-relaxed relative break-words
                                                ${isMe 
                                                    ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl rounded-tr-sm shadow-indigo-200' 
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm shadow-slate-200'
                                                }
                                                ${!isNextSame && isMe ? 'mb-1' : 'mb-0.5'}
                                            `}
                                        >
                                            {item.text}
                                        </div>
                                        
                                        {/* Time & Status */}
                                        <div className={`
                                            flex items-center gap-1 mt-1 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none
                                            ${isMe ? 'mr-1 text-slate-400' : 'ml-1 text-slate-400'}
                                        `}>
                                            {formatTime(item.createdAt)}
                                            {isMe && <CheckCheck size={13} className={item.read ? "text-indigo-500" : "text-slate-300"}/>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={scrollRef}></div>
                    </div>

                    {/* Scroll Button */}
                    {showScrollBottom && (
                        <button 
                            onClick={scrollToBottom}
                            className="absolute bottom-28 right-8 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg shadow-slate-200 border border-slate-100 text-indigo-600 hover:-translate-y-1 transition-all duration-300 z-30"
                        >
                            <ArrowDown size={20}/>
                        </button>
                    )}

                    {/* Input Area - Floating Modern Style */}
                    <div className="p-4 md:p-6 bg-transparent sticky bottom-0 z-20 pointer-events-none">
                        <form 
                            onSubmit={handleSendMessage} 
                            className="pointer-events-auto max-w-4xl mx-auto flex items-end gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 ring-1 ring-slate-200/60 focus-within:ring-indigo-500/30 focus-within:shadow-[0_8px_40px_rgb(99,102,241,0.15)] transition-all duration-300"
                        >
                            <div className="flex items-center gap-1 pl-1 pb-1">
                                <button type="button" className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"><Paperclip size={19}/></button>
                            </div>

                            <div className="flex-1 py-3">
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Write a message..." 
                                    className="w-full bg-transparent outline-none text-[15px] font-medium text-slate-800 placeholder:text-slate-400/80"
                                />
                            </div>

                            <div className="flex items-center gap-1 pr-1 pb-1">
                                {!newMessage.trim() && (
                                    <>
                                        <button type="button" className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"><ImageIcon size={19}/></button>
                                        <button type="button" className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"><Mic size={19}/></button>
                                    </>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim()}
                                    className={`
                                        p-2.5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center
                                        ${newMessage.trim() 
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-200' 
                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
                                    `}
                                >
                                    <Send size={18} className={newMessage.trim() ? "ml-0.5" : ""}/>
                                </button>
                            </div>
                        </form>
                    </div>

                </>
            ) : (
                /* Modern Empty State */
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/50">
                    <div className="relative mb-8 group cursor-default">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                        <div className="relative w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
                            <Send size={48} className="text-indigo-600 ml-2 -rotate-12 group-hover:rotate-0 transition-transform duration-500"/>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Messages</h2>
                    <p className="text-slate-500 max-w-sm text-center text-md leading-relaxed">
                        Select a conversation to start chatting. <br/>
                        All your communications are secured.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}