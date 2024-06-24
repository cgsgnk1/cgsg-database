import React, { useEffect, useRef } from "react";
import { DefaultMenu, ReturnToPageUI } from "../default/default-ui";
import { globalSocket } from "../client";

export function ChatPageUI() {
  const messageRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const func = async () => {
      const res = await fetch("/default/chat/getText", {method: "POST"});
      const data = await res.json();
      console.log(data);
      if (res.status == 200 && textRef.current) {
        textRef.current.innerHTML = data.text;
        textRef.current.scrollTop = textRef.current.scrollHeight;
      }
    };
    globalSocket.on("fServerWriteMessage", (message) => {
      if (textRef.current) {
        textRef.current.innerHTML += message + "\n";
        textRef.current.scrollTop = textRef.current.scrollHeight;
      }
    });
    func();
  });

  const send = async () => {
    const text = messageRef.current;
    if (!text || text.value == "") {
      return;
    }
    const res = await fetch("/default/chat/writeMessage", {
      method: "POST",
      body: JSON.stringify({date: Date.now(), message: text.value}),
      headers: {"Content-Type": "application/json"}
    });
    const data = await res.json();
    if (data.text) {
      globalSocket.emit("fClientWriteMessage", data.text);
    }
  }

  return (
    <div>
      <DefaultMenu checked="Chat"></DefaultMenu>
      <div className="CMUDiv" style={{top: "54px"}}>
        <a id="chatText">
        </a>
        <textarea className="accountTextarea" id="chatTextarea" rows={30} cols={60} ref={textRef} readOnly={true}></textarea>
        <br/>
        <input type="text" id="chatSendText" ref={messageRef}
          className="signInput"
          onKeyDown={(event) => {
            if (event.key == "Enter") {
              send();
            }
          }}
        />&nbsp;
        <input type="button" id="chatSendButton" value="Send"
          className="indexButton"
          onClick={send}
        />
      </div>
    </div>
  );
}
