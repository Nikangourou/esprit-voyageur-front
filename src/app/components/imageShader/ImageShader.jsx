import React, { useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";
import styles from "./ImageShader.module.scss";
import { fragmentShader, vertexShader } from "./shader/shader";
import { gsap } from "gsap";

export default function ImageShader({ url }) {
  const canvasRef = useRef();
  const planeElementRef = useRef();
  const planeRef = useRef();

  useEffect(() => {
    if (!planeRef.current) {
      const curtains = new Curtains({
        container: styles.canvas,
      });

      const params = {
        vertexShader: vertexShader, // our vertex shader ID
        fragmentShader: fragmentShader, // our fragment shader ID
        uniforms: {
          time: {
            name: "uTime", // uniform name that will be passed to our shaders
            type: "1f", // this means our uniform is a float
            value: 0,
          },
          progressDistord: {
            name: "uProgressDistord",
            type: "1f",
            value: 0.015,
          },
          progressBlur: {
            name: "uProgressBlur",
            type: "1f",
            value: 1,
          },
          progress: {
            name: "uProgress",
            type: "1f",
            value: 0,
          },
        },
      };

      planeRef.current = new Plane(curtains, planeElementRef.current, params);

      planeRef.current.onRender(() => {
        planeRef.current.uniforms.time.value++; // update our time uniform value
      });

      gsap.to(planeRef.current.uniforms.progress, {
        value: 1,
        duration: 10,
        ease: "sine.in",
        onComplete: () => {
          console.log("plop");
        },
      });

      document.querySelector(".imageShader").addEventListener("click", () => {
        gsap.to(planeRef.current.uniforms.progressDistord, {
          value: 0,
          duration: 6,
          ease: "power4.inOut",
        });

        gsap.to(planeRef.current.uniforms.progressBlur, {
          value: 0,
          duration: 8,
          ease: "sine.inOut",
        });
      });
    }
  }, [url]);

  return (
    <div className="imageShader">
      <div id={styles.canvas} ref={canvasRef}></div>
      <div className={styles.plane} ref={planeElementRef}>
        <img src={"/image.png"} crossOrigin="Access-Control-Allow-Origin" />
        <img src={"/voronoi.jpg"} crossOrigin="Access-Control-Allow-Origin" />
      </div>
    </div>
  );
}