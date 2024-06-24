import React, { useRef } from "react";
import { IndexPageDesign, IndexPageImage, IndexPagePlain } from "./index-ui";

// /reg/sign

export function SignInPageUI() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const infoRef = useRef<HTMLAnchorElement>(null);

  return (
    <div>
      <IndexPagePlain></IndexPagePlain>
      <IndexPageImage src="../default/CGSG-Logo.svg"></IndexPageImage>
      <div className="CMUDiv"
        style={{
          width: "100%",
          top: "200px",
          left: "0px"}}>
        <input placeholder="Enter username" ref={usernameRef} className="signInput" type="text"/>
      </div>
      <div className="CMUDiv"
        style={{
          width: "100%",
          top: "270px",
          left: "0px"}}>
        <input placeholder="Enter password" ref={passwordRef} className="signInput" type="password"/>
      </div>
      <div className="CMUDiv"
        style={{
          width: "100%",
          top: "340px",
          left: "0px"}}>
        <input className="indexButton" type="button" value="Sign in"
        onClick = {async () => {
          if (usernameRef.current && passwordRef.current && infoRef.current) {
            const res = await fetch("/reg/sign-in", {
              method: "POST",
              body: JSON.stringify({name: usernameRef.current.value, password: passwordRef.current.value}),
              headers: {"Content-Type": "application/json"}
            });
            const data = await res.json();
            if (res.status != 200) {
              infoRef.current.textContent = data.message;
            } else {
              location.assign("/default");
            }
          }
        }}
        />
      </div>
      <div className="CMUDiv"
        style={{
          width: "100%",
          top: "410px",
          left: "0px"}}>
        <a className="indexText">Don't have an account?</a> <a className="signHref" href="/reg/signUpPage">Sign up</a>
        <br/><br/>
        <a ref={infoRef}></a>
      </div>
    </div>
  )
}
