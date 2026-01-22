'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, query, where, onSnapshot, orderBy, 
  addDoc, serverTimestamp, updateDoc, doc, getDoc 
} from 'firebase/firestore';
import { 
  Send, Search, MoreVertical, Phone, Video, 
  Info, Image as ImageIcon, Mic, ChevronLeft, Loader2,
  CheckCheck, ArrowDown, Paperclip, Plus, Smile
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

// Play notification sound
const playNotificationSound = () => {
    try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {}); 
    } catch (e) {}
};

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // --- STATE ---
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [otherUserProfiles, setOtherUserProfiles] = useState({});
  const [isTyping, setIsTyping] = useState(false); 

  const scrollRef = useRef();
  const messagesContainerRef = useRef();

  // --- 1. PROTECT ROUTE ---
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // --- 2. LISTEN FOR CHATS (Sidebar) ---
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  // --- 3. FETCH PROFILES ---
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
                    if (userSnap.exists()) setOtherUserProfiles(prev => ({...prev, [otherId]: userSnap.data()}));
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
      snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              const msgData = change.doc.data();
              if (msgData.senderId !== user.uid) {
                  playNotificationSound();
              }
          }
      });

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
        read: false,
        type: 'text' 
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
      return otherUserProfiles[otherId] || { name: "User", avatar: "" };
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

  if (loading || !user) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-[#005871] w-10 h-10"/></div>;

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Navbar is mostly fixed, so we rely on the main div's padding to push content down */}
      <Navbar /> 

      {/* ✅ ADDED PT-24 TO CLEAR FIXED NAVBAR */}
      <div className="flex-1 flex overflow-hidden pt-24 relative max-w-[1920px] mx-auto w-full">
        
        {/* --- SIDEBAR --- */}
        <div className={`
            absolute inset-y-0 left-0 z-20 bg-white md:relative md:w-80 lg:w-96 border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight">Messages</h2>
                <button className="bg-gray-50 p-2 rounded-full hover:bg-gray-100 transition"><MoreVertical size={20} className="text-gray-600"/></button>
            </div>
            
            {/* Search */}
            <div className="p-4 pb-2">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#005871] transition" size={18}/>
                    <input type="text" placeholder="Search chats..." className="w-full bg-gray-100/80 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#005871]/20 transition-all shadow-sm"/>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                {chats.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center mt-10">
                        <div className="w-16 h-16 bg-[#005871]/10 rounded-full flex items-center justify-center mb-4 text-[#005871] animate-pulse"><Info size={28}/></div>
                        <p className="font-bold text-gray-900 mb-1">No messages yet</p>
                        <p className="text-xs text-gray-500">Book a trip to start chatting.</p>
                    </div>
                ) : (
                    chats.map(chat => {
                        const otherUser = getOtherUser(chat);
                        const isActive = activeChat?.id === chat.id;
                        return (
                            <div 
                                key={chat.id} 
                                onClick={() => { setActiveChat(chat); setIsSidebarOpen(false); }}
                                className={`flex items-center gap-4 p-4 mx-3 my-1 rounded-2xl cursor-pointer transition-all duration-200 ${isActive ? 'bg-[#005871] text-white shadow-md transform scale-[1.02]' : 'hover:bg-gray-50 text-gray-900'}`}
                            >
                                <div className="relative shrink-0">
                                    <img src={otherUser.avatar || "https://github.com/shadcn.png"} className={`w-12 h-12 rounded-full object-cover border-2 ${isActive ? 'border-white/30' : 'border-gray-200'}`}/>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`font-bold truncate text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>{otherUser.name}</h4>
                                        <span className={`text-[10px] font-medium ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                                            {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ''}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                        {chat.lastSenderId === user.uid && "You: "} 
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        {/* --- MAIN CHAT AREA --- */}
        <div className={`flex-1 flex flex-col bg-[#F0F2F5] relative transition-opacity duration-300 h-full ${!isSidebarOpen || activeChat ? 'opacity-100 z-0' : 'opacity-0 md:opacity-100 -z-10'}`}>
            
            {activeChat ? (
                <>
                    {/* Header */}
                    <div className="h-[76px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"><ChevronLeft/></button>
                            <div className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <img src={getOtherUser(activeChat).avatar || "https://github.com/shadcn.png"} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100"/>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{getOtherUser(activeChat).name}</h3>
                                    <p className="text-xs text-green-600 font-bold flex items-center gap-1">Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                            <button className="p-2.5 hover:bg-gray-100 rounded-full hover:text-[#005871] transition"><Phone size={20}/></button>
                            <button className="p-2.5 hover:bg-gray-100 rounded-full hover:text-[#005871] transition"><Video size={20}/></button>
                            <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block"></div>
                            <button className="p-2.5 hover:bg-gray-100 rounded-full hover:text-gray-900 transition"><Info size={20}/></button>
                        </div>
                    </div>

                    {/* Messages Feed */}
                    <div 
                        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2"
                        style={{ 
                            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                            backgroundSize: '20px 20px' 
                        }} 
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                    >
                        {groupedMessages.map((item, i) => {
                            if (item.type === 'date') {
                                return (
                                    <div key={`date-${i}`} className="flex justify-center my-6 sticky top-2 z-10">
                                        <span className="bg-white/80 backdrop-blur-md text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border border-gray-200 uppercase tracking-widest">
                                            {item.date}
                                        </span>
                                    </div>
                                );
                            }

                            const isMe = item.senderId === user.uid;
                            const isNextSame = groupedMessages[i+1]?.senderId === item.senderId;

                            return (
                                <div key={item.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-1 animate-in slide-in-from-bottom-2 duration-300`}>
                                    {!isMe && (
                                        <div className={`w-8 mr-2 flex flex-col justify-end ${isNextSame ? 'opacity-0' : 'opacity-100'}`}>
                                            <img src={getOtherUser(activeChat).avatar || "https://github.com/shadcn.png"} className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"/>
                                        </div>
                                    )}

                                    <div className={`max-w-[75%] md:max-w-[60%] px-5 py-3 rounded-2xl shadow-sm relative text-[15px] leading-relaxed 
                                        ${isMe 
                                            ? 'bg-gradient-to-br from-[#005871] to-[#007a8c] text-white rounded-br-none shadow-[#005871]/20' 
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        }
                                    `}>
                                        {item.type === 'image' && <img src={item.mediaUrl} className="rounded-lg mb-2 max-w-full h-auto"/>}
                                        
                                        <p>{item.text}</p>
                                        
                                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 select-none ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                            {formatTime(item.createdAt)}
                                            {isMe && <CheckCheck size={13} className="text-white/90"/>}
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
                            className="absolute bottom-24 right-8 bg-white p-3 rounded-full shadow-xl border border-gray-100 text-[#005871] hover:scale-110 transition animate-bounce"
                        >
                            <ArrowDown size={20}/>
                        </button>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-end gap-2 bg-gray-50 p-2 rounded-3xl border border-gray-200 focus-within:border-[#005871] focus-within:ring-1 focus-within:ring-[#005871]/20 focus-within:bg-white focus-within:shadow-lg transition-all duration-300">
                            <button type="button" className="p-3 text-gray-400 hover:text-[#005871] hover:bg-gray-100 rounded-full transition"><Plus size={20}/></button>
                            <div className="flex-1 py-3">
                                <input 
                                    value={newMessage}
                                    onChange={(e) => { setNewMessage(e.target.value); setIsTyping(true); setTimeout(() => setIsTyping(false), 2000); }}
                                    placeholder="Type a message..." 
                                    className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder-gray-400"
                                />
                            </div>
                            {newMessage.trim() ? (
                                <button type="submit" className="p-3 bg-[#005871] text-white rounded-full hover:bg-[#004052] active:scale-95 transition shadow-lg animate-in zoom-in">
                                    <Send size={18} className="ml-0.5"/>
                                </button>
                            ) : (
                                <>
                                    <button type="button" className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"><ImageIcon size={20}/></button>
                                    <button type="button" className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"><Mic size={20}/></button>
                                </>
                            )}
                        </form>
                        <div className="text-center mt-2 h-4">
                            {isTyping && <p className="text-[10px] text-gray-400 animate-pulse">Typing...</p>}
                        </div>
                    </div>

                </>
            ) : (
                /* Empty State */
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50/50 text-center p-8">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-gray-100 animate-pulse">
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