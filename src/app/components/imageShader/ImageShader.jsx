import React, { useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";
import styles from "./ImageShader.module.scss";
import { fragmentShader, vertexShader } from "./shader/shader";

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
        },
      };

      planeRef.current = new Plane(curtains, planeElementRef.current, params);

      planeRef.current.onRender(() => {
        planeRef.current.uniforms.time.value++; // update our time uniform value
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
