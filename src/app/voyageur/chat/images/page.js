"use client";

import styles from "./page.module.scss";
import Countdown from "../../../components/chrono/countdown";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageShader from "../../../components/imageShader/ImageShader";
import { setShaderPosition } from "../../../store/reducers/gameReducer";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../context/socketContext";
import { useState, useRef, useEffect, useContext, use } from "react";
import { v4 as uuidv4 } from "uuid";
import { gsap } from "gsap";
import Title from "../../../components/title/title";
import Button from "../../../components/button/button";

import "swiper/css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Images() {
  const [isBlurry, setIsBlurry] = useState(true);
  const [isTrue, setIsTrue] = useState(true);
  const [images, setImages] = useState([]);
  const [startChrono, setStartChrono] = useState(1000);
  const [disconnect, setDisconnect] = useState(false);
  const dispatch = useDispatch();
  const trueImageId = useSelector((state) => state.players.trueImageId);
  const falseImageId = useSelector((state) => state.players.falseImageId);
  const { socket } = useContext(SocketContext);
  const gameId = useRef(null);
  const players = useSelector((state) => state.players.players);
  const currentBluffer = useSelector((state) => state.players.currentBluffer);
  const colorStyle =
    currentBluffer && currentBluffer != ""
      ? players[currentBluffer].color
      : "#373FEF";

  const urlParams = new URLSearchParams(window.location.search);
  gameId.current = urlParams.get("gameId");

  if (typeof window === "undefined") {
    return <div></div>;
  }
  const width = window.innerWidth - window.innerWidth * 0.2;

  useEffect(() => {
    if (trueImageId && falseImageId) {
      const arrayTmp = [trueImageId, falseImageId];
      arrayTmp.forEach((imageId) => {
        fetch(`${apiUrl}/image/get/${imageId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setImages((currentImages) => [
              ...currentImages,
              {
                id: uuidv4(),
                url: `${apiUrl}${data.url}`,
                isTrue: data.isTrue,
                prompt: data.prompt,
              },
            ]);
            dispatch(setShaderPosition(1));
          });
      });
    }
  }, [trueImageId, falseImageId]);

  useEffect(() => {
    if (images.length === 2) {
      const tl = gsap
        .timeline()
        .to(".pageContainer", { opacity: 1, duration: 3, ease: "power3.out" })
        .call(
          () => {
            dispatch(setShaderPosition(1));
          },
          null,
          "<0.5"
        );

      setTimeout(() => {
        setIsBlurry(false);
      }, 500);
      socket.emit("sendActorAction", gameId.current, "ImagesGenerated", {
        TrueImageId: trueImageId,
        FalseImageId: falseImageId,
      });
      socket.emit("imagesAllGenerated", gameId.current);
      setStartChrono(30);
    }
  }, [images]);

  const onEndCountdown = () => {
    console.log("End countdown");
    if (!disconnect) {
      setDisconnect(true);
      socket?.emit("sendActorAction", gameId.current, "EndChrono", {});
    }
  };

  const onSlideChange = (swiper) => {
    console.log("Slide change");
    const currentSlide = images[swiper.activeIndex];
    setIsTrue(currentSlide.isTrue);
  };

  return (
    <div className={styles.images}>
      <div className={styles.containerCountdown}>
        <Countdown start={startChrono}/>
      </div>
      <Title text={"Prépare ton"} important={"bluff"}></Title>
      <Swiper
        className={styles.swiper}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={onSlideChange}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div className={styles.imageContainer}>
              <ImageShader
                url={image.url}
                isBlurry={isBlurry}
                width={width}
                height={width}
              ></ImageShader>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {isTrue ? <p>Vérité</p> : <p>Mensonge</p>}
      <div className={styles.containerPrompt}>
        {isTrue ? <p>{images[0]?.prompt}</p> : <p>{images[1]?.prompt}</p>}
      </div>
      <Button color={colorStyle} type="link" onClick={() => onEndCountdown()}>
        Je suis prêt
      </Button>
    </div>
  );
}
