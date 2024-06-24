import React, { forwardRef, useContext, useEffect, useRef } from "react";
import styles from "./button.module.scss";
import Blob from "../blob/blob";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { SocketContext } from "../../context/socketContext";
import { useSelector } from "react-redux";

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
    dataColor = "none",
    blobParams = {
      width: 100,
      height: 100,
      numPoints: 12,
      minRadius: 35,
      maxRadius: 40,
      minDuration: 1,
      maxDuration: 2,
    },
  },
  ref,
) {
  const { soundManager } = useContext(SocketContext);
  const buttonRef = useRef();
  const buttonTl = useRef();
  const draggableRef = useRef();
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);

  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  useEffect(() => {
    if (type == "blob") {
      buttonTl.current?.kill();

      let delay = 1;
      if (Math.random() < 0.33) {
        delay = 1.5;
      } else if (Math.random() < 0.66) {
        delay = 2.25;
      } else {
        delay = 3;
      }
      buttonTl.current = gsap.timeline().fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: "back.out(1.4)",
          delay: delay,
        },
      );
    }

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
        <button
          ref={buttonRef}
          style={{
            border: "none",
            background: "none",
            padding: "0 0",
            cursor: "pointer",
          }}
          className={styles.blobButton}
        >
          <svg
            id="svg"
            viewBox={`0 0 ${blobParams.width} ${blobParams.height}`}
            width={blobParams.width}
            height={blobParams.height}
          >
            <Blob
              {...blobParams}
              color={color}
              dataColor={dataColor}
              events={events}
            />
          </svg>
        </button>
      );
    }

    if (type == "link") {
      return (
        <div
          ref={ref}
          className={`${styles.linkButton} ${disabled && styles.disabled}`}
          {...events}
          onClick={(e) => {
            if (!disabled && events && events.onClick) {
              buttonTl.current?.kill();
              buttonTl.current = gsap
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
                  onComplete: () => {
                    soundManager.playSingleSound("cta");
                  },
                })
                .to(
                  ".pageContainer",
                  {
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    onComplete: () => {
                      events.onClick(e, buttonTl.current);
                      buttonTl.current.fromTo(
                        ".pageContainer",
                        {
                          opacity: 0,
                        },
                        {
                          opacity: 1,
                          delay: 1,
                          duration: 1,
                          pointerEvents: "auto",
                          ease: "power1.out",
                        },
                      );
                    },
                  },
                  // "<",
                );
            }
          }}
        >
          <div className={styles.principal}>
            <p>{children}</p>
          </div>
          <div
            className={styles.sub}
            style={{ background: `${colorStyle}` }}
          ></div>
        </div>
      );
    }
  }

  return selectButtonType();
});

export default Button;
