import React from "react";
import { removeToken, removeUserInfo } from "../LocalStorageService";
function AdministratorLogout() {
  removeToken();
  removeUserInfo();

  localStorage.removeItem("adminLoginStatus");
  window.location.href = "/administrator";

  return <div></div>;
}
export default AdministratorLogout;
