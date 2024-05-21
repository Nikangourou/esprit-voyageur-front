"use client";

import { useEffect, useRef } from "react";
import styles from "./footer.module.scss";
import { gsap } from "gsap";
import { useDispatch } from "react-redux";
import { setShowFooter } from "../../store/reducers/footerReducer";

export default function Footer({ children }) {
  const dispatch = useDispatch();
  const footerRef = useRef();

  useEffect(() => {
    dispatch(setShowFooter(true));
    gsap.to(footerRef.current, { opacity: 1, duration: 2, ease: "power3.out" });

    return () => {
      dispatch(setShowFooter(false));
    };
  }, []);

  return (
    <div className={styles.footer} ref={footerRef}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
