import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function SoundBtn() {
  const emitterRegistered = useRef(false);
  const barsRef = useRef();

  let animTls,
    resetTl,
    hasStarted = null;

  const [showed, setShowed] = useState(true);

  const animationStop = () => {
    if (barsRef.current && animTls) {
      animTls.forEach((elt) => {
        elt.pause();
      });
      if (resetTl) {
        resetTl.kill();
      }
      resetTl = gsap
        .timeline()
        .to(".bar", {
          height: 2,
          duration: 0.5,
          ease: "linear",
        })
        .call(() => {
          animTls.forEach((elt) => {
            elt.restart();
            elt.pause();
          });
        });
    }
  };

  const animationStart = () => {
    if (barsRef.current && animTls) {
      if (resetTl) {
        resetTl.kill();
      }
      animTls.forEach((elt) => {
        elt.play();
      });
    }
  };

  useEffect(() => {
    barsRef.current = document.querySelectorAll(".bar");
    const tls = [];

    barsRef.current.forEach((bar, index) => {
      tls.push(
        gsap
          .timeline()
          .to(bar, {
            height: 18,
            duration: 0.4 + (Math.sin(index * 2) + 1) * 0.023, // Adjust timing for even/odd bars
            ease: "linear",
            repeat: -1, // Infinite repetitions
            yoyo: true, // Alternate between growing and shrinking
          })
          .pause(),
      );
    });
    animTls = tls;
  }, []);

  return (
    <>
      <button
        className={`soundPlayer ${showed ? "" : "hidden"}`}
        onClick={toggleSound}
        aria-label={"Bouton activation et désactivation du son"}
      >
        <div className="containerSnd">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </button>
    </>
  );
}

export default SoundBtn;
