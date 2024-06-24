import React, { useEffect, useRef } from "react";
import { globalSocket } from "../client";
import { DefaultMenu, ReturnToPageUI } from "../default/default-ui";
import { IAccountProps } from "../../server/account/account";
import { createRoot } from "react-dom/client";
import { IDynamic } from "../../server/server";

export function DisplayAccount(props: IAccountProps) {
  let date = new Date(0);

  if (props.registrationDate) {
    date = new Date(props.registrationDate);
  }

  return (
    <div>
      <div className="flexDiv">
        <div className="accountImageDiv" style={{left: "10px"}}>
          <img className="accountImage" width={138 * 2} height={138 * 2} src={props.avatar}></img>
        </div>
        <div className="CMUDiv" style={{textAlign: "left", left: "300px"}}>
          <a className="accountHeader">{props.name}</a>
        </div>
  
      <div className="CMUDiv" style={{textAlign: "left", left: "800px", width: "1000px"}}>
        <a>Registration:&nbsp;{date.toDateString()}</a>
        <br/>
        <a>Service access rights:&nbsp;</a><a className={`accessRights` + props.accessRights}>{props.accessRights}</a>
        <br/>
        <a>Name:&nbsp;{props.ns ? props.ns : "not provided"}</a>
        <br/>
        <a>Place:&nbsp;{props.place ? props.place : "not provided"}</a>
        <br/>
        <a>Mail:&nbsp;{props.mail ? props.mail : "not provided"}</a>
        <br/>
        <a>Phone:&nbsp;{props.phone ? props.phone : "not provided"}</a>
        <br/>
        <a>Grade:&nbsp;{props.yearOfGrade ? props.yearOfGrade : "not provided"}'{props.classOfGrade ? props.classOfGrade : "not provided"}</a>
        <br/>
        <a>AddonInfo:&nbsp;{props.addonInfo ? props.addonInfo : "not provided"}</a>
      </div>
      </div>
    </div>
  );
}

function EditAllPropElement(props: IAccountProps) {
  const inputRefAvatar = useRef<HTMLInputElement>(null);
  const inputRefMail = useRef<HTMLInputElement>(null);
  const inputRefPhone = useRef<HTMLInputElement>(null);
  const inputRefYearOfGrade = useRef<HTMLInputElement>(null);
  const inputRefClassOfGrade = useRef<HTMLInputElement>(null);
  const inputRefAddonInfo = useRef<HTMLTextAreaElement>(null);
  const inputRefNS = useRef<HTMLInputElement>(null);

  return (
    <div className="CMUDiv" style={{textAlign: "left", top: "300px", width: "1000px"}}>
      <a>Edit image link:&nbsp;</a>
      <input
        className="signInput"
        style={{fontSize: "14px", height: "20px"}}
        type="text"
        ref={inputRefAvatar}
        defaultValue={props.avatar}
        />
      <br/>
      <a>Input name and surname:&nbsp;</a>
      <input
        className="signInput"
        style={{fontSize: "14px", height: "20px"}}
        type="text"
        ref={inputRefNS}
        defaultValue={props.ns}
        />
      <br/>
      <a>Edit mail address:&nbsp;</a>
      <input
        className="signInput"
        style={{fontSize: "14px", height: "20px"}}
        type="text"
        ref={inputRefMail}
        defaultValue={props.mail}
        />
      <br/>
      <a>Edit phone number:&nbsp;</a>
      <input
        className="signInput"
        style={{fontSize: "14px", height: "20px"}}
        type="text"
        ref={inputRefPhone}
        defaultValue={props.phone}
        />
      <br/>
      <a>Input year and class of grade:&nbsp;</a>
      <input
        className="signInput"
        style={{fontSize: "14px", height: "20px"}}
        type="number"
        min="1900"
        max="2100"
        step="1"
        ref={inputRefYearOfGrade}
        defaultValue={props.yearOfGrade}
        />&nbsp;
      <input
        className="signInput"
        style={{fontSize: "14px", height: "20px"}}
        type="number"
        min="1"
        max="7"
        step="1"
        ref={inputRefClassOfGrade}
        defaultValue={props.classOfGrade}
        />
      <br/>
      <a>Input some additional info:</a>
      <br/>
      <textarea
        className="accountTextarea"
        rows={10}
        cols={40}
        ref={inputRefAddonInfo}
        defaultValue={props.addonInfo}
        />
      <br/>
      <input type="button" value="Edit"
      className="indexButton"
        onClick = {async () => {
          const inputAvatar = inputRefAvatar.current;
          const inputMail = inputRefMail.current;
          const inputPhone = inputRefPhone.current;
          const inputYearOfGrade = inputRefYearOfGrade.current;
          const inputClassOfGrade = inputRefClassOfGrade.current;
          const inputAddonInfo = inputRefAddonInfo.current;
          const inputNS = inputRefNS.current;

          if (!inputAvatar || !inputMail || !inputPhone ||
              !inputYearOfGrade || !inputClassOfGrade || !inputAddonInfo ||
              !inputNS) {
            return;
          }

          const res = await fetch("/default/account/update", {
            method: "POST",
            body: JSON.stringify({
              avatar: inputAvatar.value,
              ns: inputNS.value,
              mail: inputMail.value,
              phone: inputPhone.value,
              yearOfGrade: inputYearOfGrade.value,
              classOfGrade: inputClassOfGrade.value,
              addonInfo: inputAddonInfo.value,
            }),
            headers: {"Content-Type": "application/json"},
          })
          const data = await res.json();

          console.log(data);
        }}/>
    </div>
  )
}

export function AccountPageUI(props: IAccountProps) {

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("effect");
    const func = async () => {
      if (divRef.current) {
        const res = await fetch("/default/account", {method: "POST"});
        if (res.status == 200) {
          const response = await res.json();
          const data = response.account;
    
          const root = createRoot(divRef.current);
          root.render(
            <div>
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
              <div>
                <EditAllPropElement
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
                ></EditAllPropElement>
              </div>
            </div>
          );
        }
      }
    }
    func();
  });

  return (
    <div>
      <DefaultMenu checked="Account"></DefaultMenu>
      <div ref={divRef} style={{position: "absolute", top: "58px", left: "0px"}}></div>
    </div>
  );
}
