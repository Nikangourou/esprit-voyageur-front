import styles from "./galerie.module.scss";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

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
  const tlRef = useRef();
  const [isTurned, setIsTurned] = useState(false);
  const [imgFull, setImgFull] = useState(null);

  useEffect(() => {
    tlRef.current?.kill();
    tlRef.current = gsap.timeline().to(`.${styles.cardFull}`, {
      rotateY: isTurned ? 180 : 0,
      duration: 0.15,
      ease: "power2.inOut",
    });
  }, [isTurned]);

  const turn = (e) => {
    e.stopPropagation();
    setIsTurned(!isTurned);
  };

  return (
    <div className={styles.galerie}>
      {imgFull && (
        <div className={styles.full} onClick={() => setImgFull(null)}>
          <div
            className={`${styles.card} ${styles.cardFull}`}
            onClick={(e) => turn(e)}
          >
            <div className={`${styles.containerImg} ${styles.front}`}>
              <img src={`/images/${imgFull.front}`} alt="verite" />
            </div>
            <div className={`${styles.containerImg} ${styles.back}`}>
              <img src={`/images/${imgFull.back}`} alt="mensonge" />
            </div>
          </div>
          <p>{isTurned ? "Vérité" : "Mensonge"}</p>
        </div>
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
