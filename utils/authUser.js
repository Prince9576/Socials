import axios from "axios";
import Router from "next/router";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

export const signupUser = async (
  user,
  profilePictureUrl,
  setErrorMsg,
  setLoading
) => {
  try {
    const response = await axios.post(baseUrl + "/api/signup", {
      user,
      profilePictureUrl,
    });
    if (response) {
      setToken(response.data);
    }
  } catch (err) {
    catchErrors(err, setErrorMsg);
  }
  setLoading(false);
};

export const loginUser = async (user, setErrorMsg, setLoading) => {
  try {
    const response = await axios.post(baseUrl + "/api/login", { user });
    if (response) {
      setToken(response.data);
    }
  } catch (err) {
    catchErrors(err, setErrorMsg);
  }
  setLoading(false);
};
const setToken = (token) => {
  cookie.set("token", token);
  Router.push("/");
};
