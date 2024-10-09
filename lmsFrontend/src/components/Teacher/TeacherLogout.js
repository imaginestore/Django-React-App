import React from "react";
import { removeToken, removeUserInfo } from "../LocalStorageService";
function TeacherLogout() {
  removeToken();
  removeUserInfo();
  localStorage.removeItem("teacherId");
  localStorage.removeItem("teacherLoginStatus");
  localStorage.removeItem("first_name");
  localStorage.removeItem("profile_image");
  window.location.href = "/teacher-login";

  return <div></div>;
}
export default TeacherLogout;
