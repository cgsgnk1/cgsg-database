import React, { useEffect } from "react";

export interface IndexPageImageProps {
  src: string,
};

export function IndexPageImage(props: IndexPageImageProps) {
  return (
    <div>
      <img className="indexCGSGImg" src={props.src}/>
    </div>
  );
}

export function IndexPagePlain() {
  return (
    <div>
      <div className="indexMainDiv">
      </div>
      <div className="indexMainDiv3">
      </div>
      <a className="indexTextCopyright">Copyright (c) Computer Graphics Support Group, NK1, June 2024.</a>
      <a className="indexTextHeader"
        style = {{
          top: "6px",
          left: "0",
          color: "white"
        }}
      >CGSG Database</a>
      <div className="CMUDiv"
        style={{right: 0, top: 0, zIndex: 101}}
      >
        <img src="../default/CGSG-Logo.svg" height={48}/>
      </div>
    </div>
  );
}

export function IndexPageDesign() {
  return (
    <div>
      <IndexPagePlain></IndexPagePlain>
      <IndexPageImage src="./default/cgsg-logo.svg"></IndexPageImage>
    </div>
  )
}

export function IndexPageUI() {
  useEffect(() => {
    const func = async () => {
      const res = await fetch("/authorize", {
        method: "POST",
      });
      if (res.status == 200) {
        location.assign("/default");
      }
    }
    func();
  })

  return (
    <div>
      <IndexPageDesign></IndexPageDesign>
      <div>
        <input className="indexButton"
          style={{
            position: "absolute",
            top: "83px",
            left: "180px",
            zIndex: "200"}}
          type="button"
          value="Get started"
          onClick = {() => {
            location.assign("/reg/signInPage");
          }}
        />
      </div>
    </div>
  );
}
