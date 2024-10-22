import React from "react";
import logo from "../logo.svg";

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
      <div>
        {/* Brief Description */}
        <h2
          style={{
            justifyContent: "center",
            display: "flex",
            fontWeight: "bold",
            fontSize: "2rem",
            marginBottom: "2rem",
            lineHeight: "1.5",
            opacity: 0.9,
          }}>
          i center divs
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "2rem",
              marginLeft: "0.5rem",
            }}
          />
        </h2>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            gap: "2rem",
            pointerEvents: "auto",
            marginBottom: "3rem",
          }}>
          <a
            href="https://linkedin.com/in/johannes178"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontSize: "1.125rem",
              opacity: 0.8,
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.opacity = "0.1")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.opacity = "1")
            }>
            linkedin
          </a>
          <a
            href="https://github.com/johannes178"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontSize: "1.125rem",
              opacity: 0.8,
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.opacity = "0.1")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.opacity = "1")
            }>
            github
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverlayContent;
