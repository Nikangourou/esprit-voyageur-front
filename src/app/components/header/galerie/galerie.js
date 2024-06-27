import styles from "./galerie.module.scss";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import Card from "../../card/card";

const images = [
  {
    front: "souvenir_1.png",
    back: "souvenir_2.png",
  },
  {
    front: "souvenir_3.png",
    back: "souvenir_4.png",
  },
  {
    front: "souvenir_5.png",
    back: "souvenir_6.png",
  },
  {
    front: "souvenir_7.png",
    back: "souvenir_8.png",
  },
  {
    front: "souvenir_9.png",
    back: "souvenir_10.png",
  },
  {
    front: "souvenir_11.png",
    back: "souvenir_12.png",
  },
  {
    front: "souvenir_13.png",
    back: "souvenir_14.png",
  },
  {
    front: "souvenir_15.png",
    back: "souvenir_16.png",
  },
  {
    front: "souvenir_17.png",
    back: "souvenir_18.png",
  },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Galerie({ setShowGalerie }) {
  const [imgFullScreen, setImgFullScreen] = useState(false);
  // const [images, setImages] = useState([]);
  const tlRef = useRef();
  const galerieRef = useRef();
  const cardRef = useRef();

  // useEffect(() => {
  //   fetch(`${apiUrl}/image/get`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       for (let i = 0; i < data.length; i += 2) {
  //         // Check if current index and next index exist in data
  //         if (data[i] && data[i + 1]) {
  //           setImages((prev) => [
  //             ...prev,
  //             {
  //               front: apiUrl + data[i].url,
  //               back: apiUrl + data[i + 1].url,
  //             },
  //           ]);
  //         }
  //       }
  //       animIn();
  //     });
  // }, []);

  useEffect(() => {
    animIn();
  }, []);

  const animIn = () => {
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
          clearProps: "x, y",
        },
        ">.25"
      );
  };

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
                      src={`/images/souvenirs/${image.front}`}
                      alt="verite"
                      style={{ width: "100%" }}
                    />
                  </div>
                }
                backChild={
                  <div style={{ width: "100%" }}>
                    <img
                      src={`/images/souvenirs/${image.back}`}
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
