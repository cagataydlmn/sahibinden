import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { sendMessage, getChats } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";

export default function ChatScreen() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [otherUserNames, setOtherUserNames] = useState({});
  const [otherUserName, setOtherUserName] = useState("");
  const [sortedChats, setSortedChats] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchChatsAndUserNames = async () => {
      if (!user) return;

      const fetchedChats = await getChats(user.uid);

      const sorted = [...fetchedChats].sort((a, b) => {
        if (b.lastMessageTimestamp && a.lastMessageTimestamp) {
          return (
            b.lastMessageTimestamp.toDate() - a.lastMessageTimestamp.toDate()
          );
        } else if (b.lastMessageTimestamp) {
          return -1;
        } else if (a.lastMessageTimestamp) {
          return 1;
        } else {
          return 0;
        }
      });

      setSortedChats(sorted);

      const otherUserIds = new Set();
      fetchedChats.forEach((chat) => {
        const otherUserId = chat.userIds.find((id) => id !== user.uid);
        if (otherUserId) {
          otherUserIds.add(otherUserId);
        }
      });

      const userNames = await fetchUserNames(Array.from(otherUserIds));
      setOtherUserNames(userNames);
    };

    fetchChatsAndUserNames();
  }, [user]);

  useEffect(() => {
    if (!chatId) {
      setOtherUserName("");
      setMessages([]); // chatId değiştiğinde mesajları da temizle

      return;
    }

    setMessages([]);

    const messagesRef = collection(db, "messages", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });

    const currentChat = sortedChats.find((chat) => chat.id === chatId);

    if (currentChat) {
      const otherUserId = currentChat.userIds.find((id) => id !== user.uid);
      setOtherUserName(otherUserNames[otherUserId] || "Bilinmiyor");
    } else {
      setOtherUserName("");
    }

    return () => unsubscribe();
  }, [chatId, sortedChats, otherUserNames, user]);
  const fetchUserNames = async (userIds) => {
    const userNames = {};
    if (userIds.length === 0) return userNames;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "in", userIds));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        let displayName = "";

        if (userData.name && userData.lastName) {
          displayName = `${userData.name} ${userData.lastName}`;
        } else if (userData.username) {
          displayName = userData.username;
        } else {
          displayName = "Bilinmiyor";
        }

        userNames[userData.uid] = displayName;
      });
    } catch (error) {
      console.error("Kullanıcı adları alınırken hata:", error);
    }
    return userNames;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !chatId) return;

    const receiverId = chatId.split("_").find((id) => id !== user.uid);
    await sendMessage(user.uid, receiverId, newMessage);
    setNewMessage("");
  };

  const getOtherUserId = (userIds) => {
    if (!userIds || userIds.length < 2) {
      return null;
    }
    return userIds.find((id) => id !== user?.uid);
  };

  return (
    <div className="messages flex h-screen bg-gray-100 font-sans justify-center items-center"> 
      <div className="border border-gray-300 rounded-lg w-3/4 h-5/6">
        <div className="flex h-full"> 
          <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">

              

              <ul className="space-y-2">
                {sortedChats.map((chat) => {
                  const otherUserId = getOtherUserId(chat.userIds);
                  const otherUserName = otherUserNames[otherUserId] || "Bilinmiyor";

                  return (
                    <li
                      key={chat.id}
                      className={`p-2 rounded-lg ${
                        chatId === chat.id ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                    >
                      <Link
                        to={`/messages/${chat.id}`}
                        className="block"
                        style={{
                          pointerEvents: chatId === chat.id ? "none" : "auto",
                        }}
                      >
                        <div className="flex items-center text-black">
                          <span>{otherUserName}</span>
                        </div>
                        <p className="text-black
                         text-sm font-medium truncate">{chat.lastMessage}</p>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessageTimestamp
                            ? new Date(
                                chat.lastMessageTimestamp.toDate()
                              ).toLocaleTimeString()
                            : ""}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            {chatId && (
              <div className="p-4 bg-white border-b border-gray-200 flex items-center">
                <h3 className="text-lg font-semibold flex-grow">
                  {otherUserName}
                </h3>
                {/* You can add more icons here if needed */}
              </div>
            )}

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user?.uid ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderId === user?.uid
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800"
                    } shadow-sm`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs text-gray-400 block mt-1">
                      {msg.timestamp
                        ? new Date(msg.timestamp.toDate()).toLocaleTimeString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesaj yaz..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
