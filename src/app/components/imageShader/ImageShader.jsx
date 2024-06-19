import React, { forwardRef, useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";
import styles from "./ImageShader.module.scss";
import { fragmentShader, vertexShader } from "./shader/shader";
import { gsap } from "gsap";
import * as THREE from "three";

const ImageShader = forwardRef(function ImageShader(
  { url, isBlurry = true, width = 700, height = 700, speed = 1},
  ref,
) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef();
  const startTimeRef = useRef(Date.now()); // Stocker le temps de départ
  const sceneRef = useRef(); // Stocker le temps de départ
  const cameraRef = useRef(); // Stocker le temps de départ
  const meshRef = useRef(); // Stocker le temps de départ

  function createPlaneShader(text1, text2) {
    const params = {
      vertexShader: vertexShader, // our vertex shader ID
      fragmentShader: fragmentShader, // our fragment shader ID
      transparent: true,
      alphaTest: 0,
      uniforms: {
        uTime: {
          value: 0,
        },
        uProgressDistord: {
          value: 0.015,
        },
        uProgressBlur: {
          value: 1,
        },
        uProgress: {
          value: 0,
        },
        uImage: {
          value: text1,
        },
        uVoronoi: {
          value: text2,
        },
        uColor: {
          value: new THREE.Color("#EFEBE2"),
        },
        uOffset: {
          value: new THREE.Vector2(Math.random() * 3, Math.random() * 3),
        },
      },
    };

    materialRef.current = new THREE.ShaderMaterial(params);

    meshRef.current = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      materialRef.current,
    );
    return meshRef.current;
  }

  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      // Scene
      rendererRef.current = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
      });
      const sizes = {
        width: width,
        height: height
      };
      rendererRef.current.setSize(sizes.width, sizes.height);

      sceneRef.current = new THREE.Scene();

      cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current.position.z = 0;
      // camera.lookAt(new THREE.Vector3(0, - 1, 0))
      sceneRef.current.add(cameraRef.current);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      rendererRef.current.setClearColor(0x000000, 0);
    }
  }, []);

  useEffect(() => {
    let requestAnimationId;

    if (sceneRef.current && url) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (textGenerated) => {
        textureLoader.load("/voronoi.jpg", (textVoronoi) => {
          if (meshRef.current) {
            sceneRef.current.remove(meshRef.current);
          }
          sceneRef.current.add(createPlaneShader(textGenerated, textVoronoi));
          // Fonction de mise à jour
          console.log("generation plane", url);
          function update() {
            const currentTime = Date.now();
            const deltaTime = currentTime - startTimeRef.current;
            startTimeRef.current = currentTime;
            materialRef.current.uniforms.uTime.value += deltaTime * 0.05; // Mettre à jour uTime avec le temps écoulé en secondes
            rendererRef.current.render(sceneRef.current, cameraRef.current); // Rendu de la scène
            requestAnimationId = requestAnimationFrame(update); // Appel récursif de la fonction update
          }
          // Démarrer la boucle de rendu
          update();
          gsap.to(materialRef.current.uniforms.uProgress, {
            value: 1,
            duration: 10,
            ease: "sine.in",
            onComplete: () => {
              console.log("done");
            },
          });
        });
      });
    }
    return () => {
      cancelAnimationFrame(requestAnimationId);
    };
  }, [url]);

  useEffect(() => {
    if (!isBlurry) {
      console.log(isBlurry);
      if (materialRef.current) {
        gsap.to(materialRef.current.uniforms.uProgressDistord, {
          value: 0,
          duration: 6,
          ease: "power4.inOut",
        });

        gsap.to(materialRef.current.uniforms.uProgressBlur, {
          value: 0,
          duration: 8,
          ease: "sine.inOut",
        });
      }
    }
  }, [isBlurry]);

  return (
    <div className={styles.imageShader} ref={ref}>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </div>
  );
});

export default ImageShader;
