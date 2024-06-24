import React, { useEffect, useRef } from "react";
import { globalSocket } from "../client";
import { DisplayAccount } from "../account/account-ui";
import { createRoot } from "react-dom/client";
import { DefaultMenu } from "../default/default-ui";
import { IndexPagePlain } from "../reg/index-ui";

export interface IAccountViewerPageUIProps {
  returnLink: string,
};

export function AccountViewerPageUI(props: IAccountViewerPageUIProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const func = async () => {
      if (divRef.current) {
        const params = new URLSearchParams(document.location.search);
        const name = params.get("name");

        const res = await fetch("/default/userSearchExplicit", {
          method: "POST",
          body: JSON.stringify({name: name}),
          headers: {"Content-Type": "application/json"}
        });
        const response = await res.json();
        const data = response.user;
        const root = createRoot(divRef.current);

        if (res.status == 200) {
          root.render(
            <div style={{position: "absolute", top: "54px"}}>
              <DisplayAccount
                name = {data.name}
                password = {data.password}
                accessRights = {data.accessRights}
                avatar = {data.avatar}
                registrationDate = {data.registrationDate}

                ns = {data.ns}
                lat = {data.lat}
                lon = {data.lon}
                place = {data.place}
                mail = {data.mail}
                phone = {data.phone}
                yearOfGrade = {data.yearOfGrade}
                classOfGrade = {data.classOfGrade}
                addonInfo = {data.addonInfo}
              >
              </DisplayAccount>
              <br/>
              <input className="indexButton" type="button" value="Back" onClick={() => {location.assign(props.returnLink)}}/>
            </div>
          );  
        } else {
          root.render(
            <div>
              <a>Unknown user</a>
              <br/>
            </div>
          );
        }
      }
    }
    func();
  });

  return (
    <div>
      <IndexPagePlain></IndexPagePlain>
      <div ref={divRef}></div>
    </div>
  );
}
