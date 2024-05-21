"use client";

import { useEffect, useRef } from "react";
import styles from "./footer.module.scss";
import { gsap } from "gsap";
import { useDispatch } from "react-redux";
import { setShowFooter } from "../../store/reducers/footerReducer";

export default function Footer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowFooter(true));

    return () => {
      dispatch(setShowFooter(false));
    };
  }, []);

 

  return (
    <div className={styles.footer}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
