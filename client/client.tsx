import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import React, { useTransition } from "react";
import { createRoot } from "react-dom/client";

import { MyLoginInput, MyPasswordInput, MySignIn, MySignUp, MyTextInfo, MyVideo } from "./reg/reg-ui";
import { DefaultPageUI } from "./default/default-ui";
import { AccountPageUI } from "./account/account-ui";
import { AccountViewerPageUI } from "./account-viewer/account-viewer-ui";
import { ChatPageUI } from "./chat/chat-ui";
import { UserSearchPageUI } from "./user-search/user-search-ui";
import { MapPageUI } from "./map/map-ui";
import { AdminPanelPageUI } from "./admin/panel/panel-ui";
import { IndexPageUI } from "./reg/index-ui";
import { SignInPageUI } from "./reg/sign-in-ui";
import { SignUpPageUI } from "./reg/sign-up-ui";

export let globalSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
let globalRoot: any;

function rootInit() {
  const rootElement = document.querySelector("#root");
  if (!rootElement) {
    return;
  }

  globalRoot = createRoot(rootElement);
}

window.addEventListener("load", () => {
  globalSocket = io();
  rootInit();

  globalSocket.on("connect", () => {
    console.log(`${globalSocket.id}`);
  });

  if (document.querySelector("#index")) {
    indexPageRender();
  } else if (document.querySelector("#sign-in")) {
    signInPageRender();
  } else if (document.querySelector("#sign-up")) {
    signUpPageRender();
  } else if (document.querySelector("#default")) {
    mainPageRender();
  } else if (document.querySelector("#account")) {
    accountPageRender();
  } else if (document.querySelector("#chat")) {
    chatPageRender();
  } else if (document.querySelector("#user-search")) {
    userSearchPageRender();
  } else if (document.querySelector("#map")) {
    mapPageRender();
  } else if (document.querySelector("#account-viewer")) {
    accountViewerPageRender("/default/mapPage");
  } else if (document.querySelector("#reg")) {
    registerPageRender();
  } else if (document.querySelector("#panel")) {
    adminPanelPageRender();
  } else if (document.querySelector("#admin-account-viewer")) {
    accountViewerPageRender("/default/admin/returnToAdminPanelPage");
  }
});

function indexPageRender(): void {
  globalRoot.render(
    <div>
      <IndexPageUI></IndexPageUI>
    </div>
  );
}

function registerPageRender(): void {
  /*<MyVideo></MyVideo>*/
  globalRoot.render(
    <div>
      <MyVideo></MyVideo>
      <MyLoginInput></MyLoginInput>
      <MyPasswordInput></MyPasswordInput>
      <br/>
      <div className="flexDiv">
        <MySignIn></MySignIn>
        &nbsp;&nbsp;&nbsp;
        <MySignUp></MySignUp>
      </div>
      <br/>
      <MyTextInfo></MyTextInfo>
    </div>
  );
}

function signInPageRender(): void {
  globalRoot.render(
    <div>
      <SignInPageUI></SignInPageUI>
    </div>
  );
}

function signUpPageRender(): void {
  globalRoot.render(
    <div>
      <SignUpPageUI></SignUpPageUI>
    </div>
  );
}

function mainPageRender(): void {
  globalRoot.render(
    <div>
      <DefaultPageUI></DefaultPageUI>
    </div>
  );
}

function accountPageRender(): void {
  globalRoot.render(
    <div>
      <AccountPageUI></AccountPageUI>
    </div>
  );
}

function chatPageRender(): void {
  globalRoot.render(
    <div>
      <ChatPageUI></ChatPageUI>
    </div>
  );
}

function userSearchPageRender(): void {
  globalRoot.render(
    <div>
      <UserSearchPageUI></UserSearchPageUI>
    </div>
  );
}

function mapPageRender() {
  globalRoot.render(
    <div>
      <MapPageUI></MapPageUI>
    </div>
  );
}

function accountViewerPageRender(returnLink: string): void {
  globalRoot.render(
    <div>
      <AccountViewerPageUI returnLink={returnLink}>
      </AccountViewerPageUI>
    </div>
  );
}

function adminPanelPageRender(): void {
  globalRoot.render(
    <div>
      <AdminPanelPageUI>
      </AdminPanelPageUI>
    </div>
  );
}
