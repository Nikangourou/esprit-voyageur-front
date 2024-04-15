import React, { forwardRef, useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";
import styles from "./ImageShader.module.scss";
import { fragmentShader, vertexShader } from "./shader/shader";
import { gsap } from "gsap";
import * as THREE from "three";

const ImageShader = forwardRef(function ImageShader(
  { url, isBlurry = true },
  ref,
) {
  const canvasRef = useRef(null);
  const materialRef = useRef();
  const textures = useRef();
  const startTimeRef = useRef(Date.now()); // Stocker le temps de départ

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

    const cube2 = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      materialRef.current,
    );
    return cube2;
  }
  function initThree(text1, text2) {
    const scene = new THREE.Scene();

    scene.add(createPlaneShader(text1, text2));

    const sizes = {
      width: 700,
      height: 700,
    };

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 0;
    // camera.lookAt(new THREE.Vector3(0, - 1, 0))
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000, 0);

    // Fonction de mise à jour
    function update() {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTimeRef.current;
      startTimeRef.current = currentTime;
      materialRef.current.uniforms.uTime.value += deltaTime * 0.05; // Mettre à jour uTime avec le temps écoulé en secondes
      renderer.render(scene, camera); // Rendu de la scène
      requestAnimationFrame(update); // Appel récursif de la fonction update
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
  }

  useEffect(() => {
    if (canvasRef.current && !textures.current) {
      // Scene
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(url ? url : "/image.png", (textGenerated) => {
        textureLoader.load("/voronoi.jpg", (textVoronoi) => {
          initThree(textGenerated, textVoronoi);
        });
      });
    }
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
