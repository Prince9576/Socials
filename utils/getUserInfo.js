import axios from "axios";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";

const getUserInfo = async (userId) => {
  console.log("Get User Info called", userId);
  try {
    if (userId) {
      const result = await axios.get(`${baseUrl}/api/chats/user/${userId}`, {
        headers: {
          Authorization: cookie.get("token"),
        },
      });
      return {
        name: result.data.name,
        profilePicUrl: result.data.profilePicUrl,
      };
    } else {
      return { error: "id_req" };
    }
  } catch (error) {
    console.error("Error looking for User");
  }
};

export default getUserInfo;
