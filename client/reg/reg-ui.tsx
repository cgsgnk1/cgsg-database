import React from "react";

function getLoginData(): string[] {
  let res = [`0`, `0`];

  let login = document.querySelector("#myLogin") as HTMLInputElement | null;
  if (login) {
    res[0] = login.value;
  }

  let password = document.querySelector("#myPassword") as HTMLInputElement | null;
  if (password) {
    res[1] = password.value;
  }

  return res;
}

export function MyVideo() {
  return (
    <div id="myVideo">
      <a id="index"></a>
      <a>CGSG NK1 CGSG Database test</a>
      <video width="500px" autoPlay={true} loop={true} poster="https://cdn-ws.playcaliber.com/media/main/2024/04/BG_Desktop_site_2.jpg" muted={true}>
        <source src="https://s-dt2.cloud.edgecore.ru/caliber-website/media/1stPerson_for_Site.mp4" type="video/mp4"/>
      </video>
      <img src="https://cgsg.pml30.ru/!inc/CGSG-Logo.svg"/>
    </div>
  );
}

export function MyLoginInput() {
  return (
    <div>
      <a>Input your login:</a><br></br>
      <input id="myLogin" type="text">
      </input>
    </div>
  );
}

export function MyPasswordInput() {
  return (
    <div>
      <a>Input your password:</a><br></br>
      <input id="myPassword" type="password">
      </input>
    </div>
  );
}

export function MySignIn() {
  return (
    <div>
      <input
        type = "button"
        className = "defaultButtonStyle"
        id = "mySignIn"
        value = "Sign in"
        onClick = {async () => {
          const login = getLoginData();
          const res = await fetch("/reg/sign-in", {
            method: "POST",
            body: JSON.stringify({name: login[0], password: login[1]}),
            headers: {"Content-Type": "application/json"}
          });
          const data = await res.json();

          if (res.status != 200) {
            console.log(data.message);
          } else {
            location.assign("/default")
          }
          // globalSocket.emit("fClientSignIn", getLoginData());
        }}
        />
    </div>
  )
}

export function MySignUp() {
  return (
    <div>
      <input
        type = "button"
        className = "defaultButtonStyle"
        id = "mySignUp"
        value = "Sign up"
        onClick = {async () => {
          const login = getLoginData();
          const res = await fetch("/reg/sign-up", {
            method: "POST",
            body: JSON.stringify({name: login[0], password: login[1]}),
            headers: {"Content-Type": "application/json"}
          });
          const data = await res.json();

          if (res.status != 200) {
            console.log(data.message);
          } else {
            location.assign("/default");
          }
        }}
        />
    </div>
  )
}

export function MyTextInfo() {
  return (
    <div className="caliberGameStyle">
      <a id="textInfo">Some text info</a>
    </div>
  )
}

/*
      <video width="500px" autoPlay={true} poster="https://cdn-ws.playcaliber.com/media/main/2024/04/BG_Desktop_site_2.jpg" muted={true}>
        <source src="https://s-dt2.cloud.edgecore.ru/caliber-website/media/1stPerson_for_Site.mp4" type="video/mp4"/>
      </video>
 */
