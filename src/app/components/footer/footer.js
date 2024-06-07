"use client";

import { forwardRef, useEffect, useRef } from "react";
import styles from "./footer.module.scss";
import { gsap } from "gsap";
import { useDispatch } from "react-redux";
import { setShowFooter } from "../../store/reducers/footerReducer";

const Footer = forwardRef(function ({ children }, ref) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowFooter(true));
    gsap.to(`.${styles.footer}`, {
      opacity: 1,
      duration: 2,
      ease: "power3.out",
    });

    return () => {
      dispatch(setShowFooter(false));
    };
  }, []);

  return (
    <div className={styles.footer} ref={ref}>
      <div className={styles.content}>{children}</div>
    </div>
  );
});

export default Footer;
