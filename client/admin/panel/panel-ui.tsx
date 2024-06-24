import React, { useEffect, useRef } from "react";
import { IAccountProps } from "../../../server/account/account";
import { createRoot } from "react-dom/client";
import { ReturnToPageUI } from "../../default/default-ui";

const helpString = `{
  name: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  registrationDate: {
    type: Number,
    default: -1,
    required: true,
  },
  accessRights: {
    type: String,
    default: "Default", // "Default", "Admin"
    required: true,
  },
  avatar: {
    type: String,
    default: "./avatarDefault.png",
    required: true,
  },
  ns: {
    type: String,
    required: false,
  },
  lat: {
    type: Number,
    required: false,
  },
  lon: {
    type: Number,
    required: false,
  },
  place: {
    type: String,
    required: false,
  },
  fullPlace: {
    type: String,
    required: false,
  },
  mail: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  yearOfGrade: {
    type: Number,
    required: false,
  },
  classOfGrade: {
    type: Number,
    required: false,
  },
  addonInfo: {
    type: String,
    required: false,
  }
};
`;

export function AdminPanelPageUI() {
  const divRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const infoRef = useRef<HTMLDetailsElement>(null);
  const inputUpdatesRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLAnchorElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const func = async () => {
      if (divRef.current) {
        const res = await fetch("/default/userSearch", {
          method: "POST",
          body: JSON.stringify({text: ""}),
          headers: {"Content-Type": "application/json"}
        });
        const data = await res.json();

        console.log(data);

        if (res.status == 200) {
          const optionsArray = data.array.map((user: IAccountProps) => {
            return (
              <option key={user.name}>{user.name}</option>
            )
          });

          const root = createRoot(divRef.current);
          if (infoRef.current) {
            infoRef.current.innerText = helpString;
          }
          root.render(
            <div>
              <ReturnToPageUI link="/default/returnToDefaultPage"></ReturnToPageUI>
              <br/>
              <select ref={selectRef}>
                {optionsArray}
              </select>&nbsp;
              <input type="button"
                value="View"
                onClick = {() => {
                  if (!selectRef.current) {
                    return;
                  }
                  location.assign(`/default/admin/accountViewerPage?name=${selectRef.current.value}`);
                }}
              />&nbsp;
              <input type="button"
                value="Delete user"
                onClick = {async () => {
                  if (!selectRef.current) {
                    return;
                  }
                  const promptRes = window.confirm(`Are you sure to delete user '${selectRef.current.value}'?`);
                  if (promptRes) {
                    const res = await fetch("/default/admin/delete", {
                      method: "POST",
                      body: JSON.stringify({name: selectRef.current.value}),
                      headers: {"Content-Type": "application/json"},
                    });
                    const data = await res.json();
                    if (statusRef.current) {
                      statusRef.current.innerText = "Status: " + res.status + ", " + "message: " + data.message;
                    }
                  }
                }}
              />
              <br/>
              <input type="text" ref={inputUpdatesRef}/>
              <input type="button"
                value="Edit user by json"
                onClick = {async () => {
                  if (!inputUpdatesRef.current || !selectRef.current) {
                    return;
                  }
                  try {
                    const str = inputUpdatesRef.current.value;
                    const updates = JSON.parse(str);
                    const res = await fetch("/default/admin/update", {
                      method: "POST",
                      body: JSON.stringify({name: selectRef.current.value, update: updates}),
                      headers: {"Content-Type": "application/json"},
                    });
                    const data = await res.json();
                    if (statusRef.current) {
                      statusRef.current.innerText = "Status: " + res.status + ", " + "message: " + data.message;
                    }
                  } catch (err) {
                    if (statusRef.current) {
                      statusRef.current.innerText = "Status: " + err;
                    }
                  }
                }}
              />
              <br/>
              <input type="password" ref={passwordRef}/>&nbsp;
              <input type="button" value="Edit password"
                onClick={async () => {
                  if (selectRef.current && passwordRef.current) {
                    const res = await fetch("/default/admin/editPassword", {
                      method: "POST",
                      body: JSON.stringify({name: selectRef.current.value, password: passwordRef.current.value}),
                      headers: {"Content-Type": "application/json"},
                    });
                    const data = await res.json();

                    if (statusRef.current) {
                      statusRef.current.innerText = "Status: " + res.status + ", " + "message: " + data.message;
                    }
                  }
                }}
              />
            </div>
          );
        }
      }
    }
    func();
  });

  return (
    <div>
      <a>Admin panel control</a>
      <div ref={divRef}></div>
      <a ref={statusRef}></a>
      <br/>
      <br/>
      <a>User schema help</a><br/>
      <details ref={infoRef}></details>
    </div>
  )
}
