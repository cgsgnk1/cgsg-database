import React from "react";
import { IndexPageImage, IndexPagePlain } from "../reg/index-ui";

export interface IReturnToPageUIProps {
  link: string,
  style?: object,
  str?: string,
  className?: string
}

export function ReturnToPageUI(props: IReturnToPageUIProps) {
  return (
    <a
      style = {props.style}
      href = {props.link}
      className = {props.className}
     >
      {props.str ? props.str : "Just some link"}
    </a>
  );
}

export interface IDefaultMenuProps {
  checked?: string;
}

export function DefaultMenu(props: IDefaultMenuProps) {
  function getClass(str: string) {
    return (str == props.checked ? "defaultChecked" : "defaultDefault");
  }
  /* <ReturnToPageUI link="/default/settings" str="Settings" className={getClass("Settings")}></ReturnToPageUI>&nbsp;&nbsp; */
  return (
    <div>
      <IndexPagePlain></IndexPagePlain>
      <div>
        <div className="CMUDiv"
          style={{left: "300px"}}>
          <ReturnToPageUI link="/default/accountPage" str="Account" className={getClass("Account")}></ReturnToPageUI>&nbsp;&nbsp;

          <ReturnToPageUI link="/default/userSearchPage" str="User search" className={getClass("User search")}></ReturnToPageUI>&nbsp;&nbsp;
          <ReturnToPageUI link="/default/chatPage" str="Chat" className={getClass("Chat")}></ReturnToPageUI>&nbsp;&nbsp;
          <ReturnToPageUI link="/default/mapPage" str="Map" className={getClass("Map")}></ReturnToPageUI>&nbsp;&nbsp;
          <ReturnToPageUI link="/default/admin/panelPage" str="Admin panel" className={getClass("Admin panel")}></ReturnToPageUI>&nbsp;&nbsp;
          <ReturnToPageUI link="/sign-out" str="Sign out" className={getClass("Sign out")}></ReturnToPageUI>
        </div>
      </div>
    </div>
  );
}

export function DefaultPageUI() {
  return (
    <div>
      <DefaultMenu></DefaultMenu>
    </div>
  );
}
