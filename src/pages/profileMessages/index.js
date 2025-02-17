import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage, getChats } from "../../firebase";
import { getAuth } from "firebase/auth";

export default function ChatScreen() {
  const { chatId } = useParams();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getChats(user.uid);
      setChats(chats);
    };

    fetchChats();
  }, [user.uid]);

  useEffect(() => {
    if (chatId) {
      const fetchMessages = async () => {
        const messages = await getMessages(chatId);
        setMessages(messages);
      };

      fetchMessages();
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const receiverId = chatId.split("_").find((id) => id !== user.uid);
    await sendMessage(user.uid, receiverId, newMessage);
    setNewMessage("");

    // Mesajları yeniden yükle
    const updatedMessages = await getMessages(chatId);
    setMessages(updatedMessages);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sohbet Listesi */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Sohbetler</h2>
          <ul className="mt-4 space-y-2">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`p-2 rounded-lg ${
                  chatId === chat.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                <a href={`/chat/${chat.id}`} className="block">
                  <p className="text-sm font-medium">{chat.lastMessage}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(chat.lastMessageTimestamp?.toDate()).toLocaleTimeString()}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Aktif Sohbet */}
      <div className="flex-1 flex flex-col">
        {chatId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user.uid ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderId === user.uid
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs text-gray-400 block mt-1">
                      {new Date(msg.timestamp?.toDate()).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mesaj Gönderme Inputu */}
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Bir sohbet seçin</p>
          </div>
        )}
      </div>
    </div>
  );
}