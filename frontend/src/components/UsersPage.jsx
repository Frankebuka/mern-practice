import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import Tooltip from "../components/Tooltip";
import { toast } from "react-toastify";
import { ChatState } from "../../Contest/ChatProvider";
import User from "../components/User";
import {
  getReceiverId,
  getSenderName,
  getSenderOnlineStatue,
  getSenderPic,
} from "../config/ChatLogics";
import Lottie from "lottie-react";
import loadingAnimation from "../animations/loading.json";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loggedUser, setLoggedUser] = useState();

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    fetchAgain,
    setFetchAgain,
    isTyping,
    recipientId,
  } = ChatState();

  const handleSearch = async (event) => {
    if (event.key === "Enter" && !search) {
      toast.warning("Please enter something in search", {
        position: "top-left",
      });
      return;
    }

    if (event.key === "Enter" && search) {
      setLoading(true);
      const res = await fetch(`/api/user?search=${search}`);
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        toast.error("Error Occurred!", {
          position: "bottom-left",
        });
        return;
      }

      setSearchResult(data);
      setSelectedChat(null);
      setLoading(false);
    }
  };

  const accessSelectedChat = async (userId) => {
    setLoadingChat(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();

    if (data.success === false) {
      setLoadingChat(false);
      toast.error("Error fetching chat", {
        position: "bottom-left",
      });
      return;
    }

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

    setSelectedChat(data);
    setLoadingChat(false);
  };

  const fetchChats = async () => {
    const res = await fetch("/api/chat");
    const data = await res.json();
    if (data.success === false) {
      toast.error("Error Occurred!", {
        position: "bottom-left",
      });
      return;
    }
    setChats(data);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, selectedChat]);

  const unreadUpdate = async (chat) => {
    if (!chat.latestMessage) {
      setSelectedChat(chat);
    } else {
      const config = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          messageId: chat.latestMessage?._id,
          chatId: chat?._id,
        }),
      };
      try {
        const res = await fetch("/api/message/update", config);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div className="users_container">
      <div className="input-wrapper">
        <Tooltip text={"Search user to chat"}>
          <MdSearch className="MdSearch" />
        </Tooltip>
        <input
          type="text"
          placeholder="Search or add new chat"
          className="search"
          onKeyDown={handleSearch}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          style={{
            width: 50,
            height: 50,
          }}
        />
      ) : (
        searchResult?.map((user) => (
          <User
            key={user._id}
            user={user}
            accessSelectedChat={accessSelectedChat}
          />
        ))
      )}
      {loadingChat && (
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          style={{
            width: 50,
            height: 50,
          }}
        />
      )}
      {!selectedChat && <hr />}

      {chats &&
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => unreadUpdate(chat)}
            className={`user_wrapper ${
              chat?._id === selectedChat?._id && "selected_user"
            }`}
          >
            <div className="user_info">
              <div className="user_detail">
                <img
                  src={
                    !chat.isGroupChat
                      ? loggedUser &&
                        chat.users &&
                        getSenderPic(loggedUser, chat.users)
                      : chat.pic
                  }
                  alt="image"
                  className="avatar"
                />
                <h4 className="truncate2">
                  {!chat.isGroupChat
                    ? loggedUser &&
                      chat.users &&
                      getSenderName(loggedUser, chat.users)
                    : chat.chatName}
                </h4>
                {chat.latestMessage?.unread &&
                  chat.latestMessage?.sender._id !== user._id && (
                    <small className="unread">New</small>
                  )}
              </div>
              <div
                className={`user_status ${
                  !chat.isGroupChat
                    ? loggedUser &&
                      chat.users &&
                      getSenderOnlineStatue(loggedUser, chat.users)
                      ? "online"
                      : "offline"
                    : null
                }`}
              ></div>
            </div>
            <p className="truncate">
              <strong>
                {chat.latestMessage?.sender._id === user._id && "Me:"}
              </strong>
              {!chat.isGroupChat ? (
                isTyping &&
                recipientId === getReceiverId(loggedUser, chat?.users) ? (
                  <small style={{ marginLeft: 5, fontSize: 10 }}>
                    typing...
                  </small>
                ) : (
                  chat.latestMessage &&
                  (chat.latestMessage.content ||
                    (chat.latestMessage.pic && <>Photo</>))
                )
              ) : (
                chat.latestMessage &&
                (chat.latestMessage.content ||
                  (chat.latestMessage.pic && <>Photo</>))
              )}
            </p>
          </div>
        ))}

      {/* mobile view */}
      {chats &&
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`sm_container ${
              chat?._id === selectedChat?._id && "selected_user"
            }`}
          >
            <img
              src={
                !chat.isGroupChat
                  ? loggedUser &&
                    chat.users &&
                    getSenderPic(loggedUser, chat.users)
                  : chat.pic ||
                    "https://alppetro.co.id/dist/assets/images/default.jpg"
              }
              alt="avatar"
              className="avatar sm_screen"
            />
            <p className="truncate2 sm_screen">
              {!chat.isGroupChat
                ? loggedUser &&
                  chat.users &&
                  getSenderName(loggedUser, chat.users)
                : chat.chatName}
            </p>
          </div>
        ))}
    </div>
  );
};

export default UsersPage;
