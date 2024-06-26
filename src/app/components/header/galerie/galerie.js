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
        <div className={styles.close} onClick={() => setShowGalerie(false)}>
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
