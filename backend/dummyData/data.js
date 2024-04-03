export const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Frank E",
        email: "frank@example.com",
      },
      {
        name: "Racheal",
        email: "racheal@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "Frank E",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Frank E",
        email: "frank@example.com",
      },
      {
        name: "Racheal",
        email: "racheal@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "New Group",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Guest User",
        email: "guest@example.com",
      },
      {
        name: "Frank",
        email: "frank@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Guest User",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "User",
        email: "user@example.com",
      },
      {
        name: "Frank",
        email: "frank@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "User",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Frank E",
        email: "frank@example.com",
      },
      {
        name: "user",
        email: "user@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "New",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
];
