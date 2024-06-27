import styles from "./galerie.module.scss";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
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
  const [imgFullScreen, setImgFullScreen] = useState(false);
  const tlRef = useRef();
  const galerieRef = useRef();
  const cardRef = useRef();


  useEffect(() => {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline()
      .fromTo(
        `.${styles.galerie}`,
        { backgroundColor: "rgba(28, 28, 30, 0)", opacity: 1 },
        { backgroundColor: "rgba(28, 28, 30, 1)", duration: 0.75 }
      )
      .fromTo(
        `.${styles.containerCard}`,
        { opacity: 0, scale: 0.75},
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
          clearProps: "x, y",
        },
        ">.25"
      );
  }, []);

  function animOut(onComplete) {
    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline({ onComplete: onComplete })
      .to(`.${styles.containerCard}`, {
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
        "<.25"
      );
  }

  const setCardFullScreen = (e) => {
    setImgFullScreen(true);
    gsap.registerPlugin(Flip);
    const card = e.currentTarget;
    cardRef.current = card;
    const state = Flip.getState(card);

    // Définir votre élément de grande taille
    // Ici, vous pouvez le positionner ou lui appliquer le style que vous voulez afficher en grand
    gsap.set(card, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(2)",
      zIndex: 121,
    });

    // Animer de l'état précédent à l'état agrandi
    Flip.from(state, {
      duration: 1,
      ease: "power1.inOut",
      scale: true,
    });
  };

  const removeCardFullScreen = () => {
    setImgFullScreen(false);
    const state = Flip.getState(cardRef.current);

    // Remettre la carte à sa place
    gsap.set(cardRef.current, {
      position: "relative",
      top: "auto",
      left: "auto",
      transform: "none",
    });

    Flip.from(state, {
      duration: 1,
      ease: "power1.inOut",
      scale: true,
      onComplete: () => {
        gsap.set(cardRef.current, {
          zIndex: 0,
        });
      },
    });
  };

  return (
    <div className={styles.galerie} ref={galerieRef}>
      <div
        className={`${styles.full} ${imgFullScreen && styles.active}`}
        onClick={() => removeCardFullScreen()}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={styles.fullContainer}
        ></div>
      </div>
      {/* <p>{isTurned ? "Vérité" : "Mensonge"}</p> */}
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
          <div className={styles.containerCard} key={index}>
            <div onClick={(e) => setCardFullScreen(e)}>
              <Card
                blockRotation={!imgFullScreen}
                stylesCard={{
                  position: "relative",
                  width: "160px",
                  height: "160px",
                  background: "var(--backgroundColor)",
                  transform: "translate(0, 0)",
                }}
                frontChild={
                  <div style={{ width: "100%" }}>
                    <img
                      src={`/images/${image.front}`}
                      alt="verite"
                      style={{ width: "100%" }}
                    />
                  </div>
                }
                backChild={
                  <div style={{ width: "100%" }}>
                    <img
                      src={`/images/${image.back}`}
                      alt="mensonge"
                      style={{ width: "100%" }}
                    />
                  </div>
                }
              ></Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
