import React, { useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";
import styles from "./ImageShader.module.scss";

export const vertexShader = `
    precision mediump float;
    
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    
    uniform mat4 uTextureMatrix0;
    
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    
    void main() {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        
        // varyings
        vVertexPosition = aVertexPosition;
        vTextureCoord = (uTextureMatrix0 * vec4(aTextureCoord, 0.0, 1.0)).xy;
    }
`;

export const fragmentShader = `
     precision mediump float;

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    
    uniform sampler2D uSampler0;
    
    uniform float uTime;
    
    void main() {
        vec2 textureCoord = vTextureCoord;
        // displace our pixels along the X axis based on our time uniform
        // textures coords are ranging from 0.0 to 1.0 on both axis
        textureCoord.x += sin(textureCoord.y * 25.0) * cos(textureCoord.x * 25.0) * (cos(uTime / 50.0)) / 25.0;
        
        gl_FragColor = texture2D(uSampler0, textureCoord);
    }
`;

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
        <img src={url} crossOrigin="Access-Control-Allow-Origin" />
      </div>
    </div>
  );
}
