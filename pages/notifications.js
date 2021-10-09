import axios from "axios";
import React from "react";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";

const Notifications = ({ notifications, errorLoading }) => {
  console.log({ notifications, errorLoading });
};

Notifications.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  try {
    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: {
        Authorization: token,
      },
    });
    return {
      notifications: res.data,
    };
  } catch (error) {
    return {
      errorLoading: true,
    };
  }
};

export default Notifications;
