import React from "react";
import { removeToken, removeUserInfo } from "../LocalStorageService";
function StudentLogout() {
  removeToken();
  removeUserInfo();
  localStorage.removeItem("studentId");
  localStorage.removeItem("studentLoginStatus");
  localStorage.removeItem("first_name");
  localStorage.removeItem("profile_image");
  window.location.href = "/user-login";
  //window.location.href = "/";

  return <div></div>;
}
export default StudentLogout;
