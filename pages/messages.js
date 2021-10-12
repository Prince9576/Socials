import axios from "axios";
import React, { useEffect, useState } from "react";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";

const Messages = ({ chatsData }) => {
  const [chats, setChats] = useState(chatsData);
  console.log("Chats ", chats);
  return <></>;
};

Messages.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  try {
    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: {
        Authorization: token,
      },
    });
    return {
      chatsData: res.data,
    };
  } catch (error) {
    return {
      errorLoading: true,
    };
  }
};

export default Messages;
