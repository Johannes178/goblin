import React from "react";

const OverlayContent = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9999,
      }}>
      <div
        style={{
          textAlign: "center",
        }}>
        <h1
          style={{
            fontSize: "7rem",
            fontWeight: "bold",
          }}>
          Joki.dev
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
          }}></p>
        linkedin github
      </div>
    </div>
  );
};

export default OverlayContent;
