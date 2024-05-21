import React, { forwardRef, useContext, useEffect, useRef } from "react";
import styles from "./button.module.scss";
import Blob from "../blob/blob";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { SocketContext } from "../../context/socketContext";

gsap.registerPlugin(Draggable);

const Button = forwardRef(function Button(
  {
    events,
    color = "none",
    colorActive = false,
    children,
    type = "cta",
    disabled = false,
    dragContainer = null,
    dragEndEvent = null,
    dataColor = null,
  },
  ref,
) {
  const { soundManager } = useContext(SocketContext);
  const buttonRef = useRef();
  const draggableRef = useRef();

  useEffect(() => {
    if (dragContainer) {
      draggableRef.current = Draggable.create(buttonRef.current, {
        type: "x,y",
        bounds: dragContainer,
        onDragEnd: (e) => {
          if (dragEndEvent) {
            dragEndEvent(e);
          }
        },
      });
    }

    return () => {
      if (dragContainer) {
        draggableRef.current[0].kill();
      }
    };
  }, []);

  function selectButtonType() {
    if (type == "buttonMenu") {
      return (
        <button
          {...events}
          className={`${styles.button} ${styles[type]}`}
          data-color={dataColor != "none" ? dataColor : "none"}
          style={colorActive ? { backgroundColor: color } : {}}
          ref={buttonRef}
        >
          <svg
            viewBox="0 0 87 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.28904 58.5408C5.6283 49.7704 8.06 40.2206 8.57556 30.4566C9.20282 18.7142 14.7622 5.02756 36.0375 1.16481C75.3142 -5.9526 53.8929 21.2323 77.1015 37.0088C100.31 52.7852 77.9693 91.9352 58.0861 79.6618C38.2028 67.3883 40.0846 71.1654 16.412 72.1076C0.825041 72.7328 -2.17377 65.5383 1.28904 58.5494V58.5408Z" />
          </svg>
          {children}
        </button>
      );
    }

    if (type == "player") {
      return (
        <button
          {...events}
          className={`${styles.button} ${styles[type]}`}
          data-color={dataColor != "none" ? dataColor : "none"}
          style={colorActive ? { backgroundColor: color } : {}}
          ref={buttonRef}
        />
      );
    }

    if (type == "blob") {
      return (
        <Blob
          ref={ref}
          numPoints={4}
          width={200}
          height={100}
          minRadius={40}
          maxRadius={42}
          minDuration={1}
          maxDuration={2}
          color={color}
        />
      );
    }

    if (type == "link") {
      return (
        <div
          ref={ref}
          className={`${styles.buttonBis} ${disabled && styles.disabled}`}
          {...events}
          onClick={(e) => {
            if (events && events.onClick) {
              gsap
                .timeline()
                .to(`.${styles.principal}`, {
                  backgroundColor: "#dad6d3",
                  y: 0,
                  pointerEvents: "none",
                  duration: 0.15,
                  ease: "power2.out",
                })

                .to(`.${styles.principal}`, {
                  backgroundColor: "#EFEBE2",
                  y: -8,
                  duration: 0.25,
                  ease: "power2.out",
                })
                .call(() => {
                  soundManager.playSingleSound("cta");
                })
                .to(".pageContainer", {
                  opacity: 0,
                  duration: 1.5,
                  ease: "power3.out",
                })
                .call(() => {
                  events.onClick(e);
                })
                .to(".pageContainer", {
                  opacity: 1,
                  delay: 1,
                  duration: 3,
                  pointerEvents: "auto",
                  ease: "power2.out",
                });
            }
          }}
        >
          <div className={styles.principal}>
            <p>{children}</p>
          </div>
          <div className={styles.sub} style={{ background: `${color}` }}></div>
        </div>
      );
    }
  }

  return selectButtonType();
});

export default Button;
