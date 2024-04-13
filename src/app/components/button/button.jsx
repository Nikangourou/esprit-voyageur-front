import React, { useEffect, useRef } from "react";
import styles from "./button.module.scss";

export default function Button({
  events,
  color = "none",
  colorActive = false,
  children,
  type = "cta",
}) {
  const buttonRef = useRef();

  function selectButtonType() {
    if (type == "buttonMenu") {
      return (
        <>
          <svg
            viewBox="0 0 87 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.28904 58.5408C5.6283 49.7704 8.06 40.2206 8.57556 30.4566C9.20282 18.7142 14.7622 5.02756 36.0375 1.16481C75.3142 -5.9526 53.8929 21.2323 77.1015 37.0088C100.31 52.7852 77.9693 91.9352 58.0861 79.6618C38.2028 67.3883 40.0846 71.1654 16.412 72.1076C0.825041 72.7328 -2.17377 65.5383 1.28904 58.5494V58.5408Z" />
          </svg>
          {children}
        </>
      );
    }
  }

  return (
    <button
      {...events}
      className={`${styles.button} ${styles[type]}`}
      data-color={color != "none" ? color : "none"}
      style={colorActive ? { color: color } : {}}
      ref={buttonRef}
    >
      {selectButtonType()}
    </button>
  );
}
