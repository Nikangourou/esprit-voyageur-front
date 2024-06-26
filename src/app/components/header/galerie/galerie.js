import styles from "./galerie.module.scss";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Card from "../../card/card";

const images = [
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
  {
    front: "/carteFront.jpg",
    back: "/carteBack.jpg",
  },
];

export default function Galerie({ setShowGalerie }) {
  const [imgFull, setImgFull] = useState(null);
  const tlRef = useRef();

  useEffect(() => {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline()
      .fromTo(
        `.${styles.galerie}`,
        { backgroundColor: "rgba(28, 28, 30, 0)", opacity: 1 },
        { backgroundColor: "rgba(28, 28, 30, 1)", duration: 0.75 },
      )
      .fromTo(
        `.${styles.card}`,
        { opacity: 0, scale: 0.75 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: "back.out(1.7)",
          stagger: {
            amount: 0.5,
            from: "left",
            axis: "x",
            grid: "auto",
          },
        },
        ">.25",
      );
  }, []);

  function animOut(onComplete) {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline({ onComplete: onComplete })
      .to(`.${styles.card}`, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "back.out(1.7)",
      })
      .to(
        `.${styles.galerie}`,
        {
          backgroundColor: "rgba(28, 28, 30, 0)",
          opacity: 0,
          duration: 1,
        },
        "<.25",
      );
  }

  return (
    <div className={styles.galerie}>
      {imgFull && (
        <div className={styles.full} onClick={() => setImgFull(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Card
              stylesCard={{
                width: "440px",
                height: "440px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "var(--backgroundColor)",
              }}
              frontChild={
                <div style={{ width: "100%" }}>
                  <img
                    src={`/images/${imgFull.front}`}
                    alt="verite"
                    style={{ width: "100%" }}
                  />
                </div>
              }
              backChild={
                <div style={{ width: "100%" }}>
                  <img
                    src={`/images/${imgFull.back}`}
                    alt="mensonge"
                    style={{ width: "100%" }}
                  />
                </div>
              }
            ></Card>
          </div>
        </div>

        //   <p>{isTurned ? "Vérité" : "Mensonge"}</p>
      )}
      <div className={styles.header}>
        <div
          className={styles.close}
          onClick={() => {
            animOut(() => {
              setShowGalerie(false);
            });
          }}
        >
          <img src="/images/close.svg" alt="close" />
        </div>
      </div>
      <div className={styles.content}>
        {images.map((image, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => setImgFull(image)}
          >
            <div className={styles.containerImg}>
              <img src={`/images/${image.front}`} alt="verite" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
