import React from "react";
const storeToken = (value) => {
  if (value) {
    const { access, refresh } = value;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};

const getToken = () => {
  let access_token = localStorage.getItem("access_token");
  let refresh_token = localStorage.getItem("refresh_token");
  return { access_token, refresh_token };
};

const removeToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

const storeUserInfo = (id, username, usertype) => {
  if ((id, username, usertype)) {
    localStorage.setItem("user_id", id);
    localStorage.setItem("user_name", username);
    localStorage.setItem("user_type", usertype);
  }
};

const getUserInfo = () => {
  let user_id = localStorage.getItem("user_id");
  let user_name = localStorage.getItem("user_name");
  let user_type = localStorage.getItem("user_type");
  return { user_id, user_name, user_type };
};

const removeUserInfo = () => {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_type");
  localStorage.removeItem("profile_image");
};

export {
  storeToken,
  getToken,
  removeToken,
  storeUserInfo,
  getUserInfo,
  removeUserInfo,
};
