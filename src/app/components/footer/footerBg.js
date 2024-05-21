"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./footer.module.scss";
import { gsap } from "gsap";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

export default function FooterSvg() {
  const pathRef = useRef(null);
  const showFooter = useSelector((state) => state.footer.showFooter);
  const pathname = usePathname();
  const [path, setPath] = useState();

  useEffect(() => {
    gsap.to(pathRef.current, {
      attr: {
        d: "M802 0.5C445.5 0.49818 340 118 4 118V212.928L1370.5 212.927V101.5C1138.5 101.5 994.5 0.500983 802 0.5Z",
      },
      duration: 10,
      ease: "sine.inOut",
      yoyo: true, // Permet de revenir à l'état initial après
      repeat: -1, // Répète l'animation indéfiniment
    });
  }, [showFooter]);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return (
    <div className={`${styles.bg} ${!showFooter ? styles.hidden : ""}`}>
      <svg
        width="100%"
        height={path == "/voyageur/chat" ? "60svh" : 180}
        viewBox="0 0 1366 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio={"none"}
      >
        <path
          ref={pathRef}
          d="M799 41.5C442.5 41.4982 337 0 1 0V179.928L1367.5 179.927V8C1135.5 8 991.5 41.501 799 41.5Z"
          fill="#E8E3D8"
        />
      </svg>
    </div>
  );
}