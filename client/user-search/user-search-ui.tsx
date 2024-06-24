import React, { useRef } from "react";
import { DefaultMenu, ReturnToPageUI } from "../default/default-ui";
import { DisplayAccount } from "../account/account-ui";
import { createRoot } from "react-dom/client";

export function UserSearchPageUI() {
  const divRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <DefaultMenu checked="User search"></DefaultMenu>
      <div className="CMUDiv" style={{position: "absolute", top: "54px"}}>
        <a>Search users:</a>&nbsp;&nbsp;&nbsp;
        <input
          className="signInput"
          type = "text"
          id = "userSearchText"
          ref = {inputRef}
          >
        </input>

        &nbsp;&nbsp;&nbsp;

        <input type="button"
          className="indexButton"
          value = "Search"
          onClick = {async () => {
            const text = inputRef.current;
            if (text) {
              const res = await fetch("/default/userSearch", {
                method: "POST",
                body: JSON.stringify({text: text.value}),
                headers: {"Content-Type": "application/json"}
              });
              const data = await res.json();
      
              if (res.status != 200) {
                console.log(data.message);
              } else {
                const users = divRef.current;
                const input = inputRef.current;
                if (!users || !input) {
                  return;
                }
  
                const array: React.JSX.Element[] = [];
                
                for (const user of data.array) {
                  if (user.name.includes(input.value)) {
                    array.push((
                      <div key={user.name}>
                        <DisplayAccount
                          name = {user.name}
                          accessRights = {user.accessRights}
                          avatar = {user.avatar}
                          registrationDate = {user.registrationDate}
                          place = {user.place}
  
                          ns = {user.ns}
                          lat = {user.lat}
                          lon = {user.lon}
                          mail = {user.mail}
                          phone = {user.phone}
                          yearOfGrade = {user.yearOfGrade}
                          classOfGrade = {user.classOfGrade}
                          addonInfo = {user.addonInfo}
                        >
                        </DisplayAccount>
                        <br/>
                        <br/>
                      </div>
                    ));
                  }
                }
                const root = createRoot(users);
                root.render(array);
              }
              // globalSocket.emit("fClientUserSearch", text.value);
            }
          }}
        >
        </input><br/><br/>
        <div id="users" ref={divRef}></div>
      </div>
    </div>
  );
}
