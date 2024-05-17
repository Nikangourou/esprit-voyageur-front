"use client";

import { useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import Chat from "../components/chat/chat";
import { SocketContext } from "../context/socketContext";
import { useDispatch } from "react-redux";
import { setGameId, setCurrentBluffer } from "../store/reducers/playersReducer";
import Button from "../components/button/button";
import { useSelector } from "react-redux";
import {
  setDistanceCircle,
  setShaderPosition,
} from "../store/reducers/gameReducer";
import { gsap } from "gsap";

export default function Voyageur() {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const gameIdRef = useRef();
  const currentBlufferRef = useRef();
  const tlRef = useRef();

  const players = useSelector((state) => state.players.players);
  const [colorStyle, setColorStyle] = useState("#373FEF");

  const logo = (
    <svg
      width="440"
      height="264"
      viewBox="0 0 440 264"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M299.209 41.1457C295.856 36.6731 302.818 30.368 314.938 28.0732C327.057 25.6336 339.694 26.6306 343.302 30.1731C346.656 33.8102 339.694 39.0682 327.574 42.399C315.454 45.6072 302.818 45.5627 299.209 41.1457ZM351.553 52.046C351.553 58.4291 343.558 59.8717 343.558 71.4403C343.558 83.9057 351.553 85.5656 351.553 94.5331C351.553 104.046 342.786 106.23 326.28 107.55C309.78 109.232 301.008 108.268 301.008 98.5378C301.008 90.2053 309.002 89.3252 309.002 77.7956C309.002 69.5633 299.203 69.14 299.203 62.3447C299.203 56.8083 312.289 49.651 325.375 46.7379C338.461 43.6578 351.547 44.8219 351.547 52.046H351.553Z"
        fill="#1C1C1E"
      />
      <path
        d="M360.757 152.715C360.757 145.012 365.654 139.47 371.589 140.723C372.793 140.974 373.998 141.241 375.197 141.519C381.904 142.75 392.991 121.462 406.138 128.993C413.872 133.209 419.807 140.69 419.807 149.624C419.807 153.567 418.775 156.04 417.486 158.457C420.063 159.95 422.644 161.532 425.22 163.209C431.15 167.119 436.052 175.908 436.052 181.935C436.052 187.961 431.155 189.938 425.22 186.875C420.751 184.497 416.282 182.347 411.812 180.414C411.812 192.473 411.812 204.821 411.812 217.459C411.812 228.616 414.133 236.33 428.057 231.662C433.731 230.431 444.302 236.57 438.112 245.186C431.405 255.735 416.193 260.297 405.367 260.258C391.698 260.687 375.197 247.732 375.197 220.712C375.197 202.749 375.197 185.555 375.197 169.118C373.993 168.89 372.788 168.667 371.589 168.467C365.659 167.47 360.757 160.412 360.757 152.704V152.715Z"
        fill="#1C1C1E"
      />
      <path
        d="M369.529 223.887C369.529 207.239 369.529 191.248 369.529 175.914C369.529 173.809 368.025 171.998 365.954 171.647C365.943 171.647 365.932 171.647 365.915 171.642C359.986 170.645 355.083 163.588 355.083 155.879C355.083 154.169 355.327 152.565 355.766 151.117C356.343 149.229 355.661 147.168 353.984 146.137C348.354 142.667 341.52 141.147 333.747 142.049C325.752 143.018 318.535 146.934 312.605 152.649C304.611 134.825 261.55 171.001 261.55 186.853C261.55 198.166 271.349 199.146 271.349 212.965C271.349 232.019 263.354 231.819 263.354 244.245C263.354 258.276 272.121 263.333 288.627 263.434C305.127 263.567 313.899 257.563 313.899 240.864C313.899 224.784 305.904 223.431 305.904 200.071V197.993C305.904 179.417 315.959 161.048 324.725 159.717C331.687 158.675 336.329 171.375 336.329 186.363C336.329 209.339 328.595 219.626 328.595 240.263C328.595 257.24 337.361 263.439 353.867 263.434C364.866 263.445 372.433 260.582 376.175 253.436C376.869 252.116 376.78 250.506 375.992 249.236C372.078 242.925 369.529 234.493 369.529 223.887Z"
        fill="#1C1C1E"
      />
      <path
        d="M95.813 115.174C95.813 108.217 101.804 99.7121 109.732 92.7274C110.881 91.7137 111.159 89.9982 110.315 88.7171C108.216 85.5367 104.807 83.5149 100.404 83.4926C90.6053 83.3756 84.1595 88.7116 79.0017 101.049C72.0396 117.72 79.0018 126.247 69.7189 146.605C69.6356 146.8 69.5468 146.995 69.4635 147.19C62.5014 127.055 64.3058 115.23 58.6317 100.759C53.2186 86.4892 44.7075 78.0564 28.2071 73.5837C11.9622 69.5846 -2.7338 68.9273 3.19567 83.2141C10.9295 102.508 20.9896 112.729 30.2724 137.47C34.4864 148.805 38.6947 160.067 42.9086 171.018C48.0664 185.739 61.9906 192.946 68.9528 180.643C74.1105 171.001 79.2682 160.429 84.426 148.978C88.5677 139.782 93.0537 133.048 97.2843 127.166C97.9116 126.297 98.056 125.161 97.634 124.175C96.5625 121.663 95.8186 118.811 95.8186 115.163L95.813 115.174Z"
        fill="#1C1C1E"
      />
      <path
        d="M203.777 96.2307C203.999 95.384 203.566 94.4984 202.761 94.1642C200.379 93.1672 198.636 91.3292 198.03 88.5554C197.103 84.3557 198.358 80.4957 201.045 77.0201C201.567 76.3462 201.539 75.3937 200.967 74.7588C198.469 71.9738 194.91 70.5535 190.496 71.3333C175.284 74.0959 166.257 90.282 155.17 94.9607C155.17 94.3035 155.43 93.2619 155.425 92.2705C155.425 60.4831 103.081 94.6043 103.081 115.174C103.081 128.441 112.88 131.243 112.88 145.251C112.88 164.295 104.886 163.877 104.886 175.897C104.886 189.175 113.652 192.829 130.158 188.774C146.658 184.43 155.43 176.743 155.43 164.094C155.43 151.467 147.436 152.631 147.436 131.594C147.436 125.305 148.985 112.979 154.142 111.771C162.137 110.161 172.708 125.868 184.056 121.652C192.229 118.772 200.401 109.086 203.788 96.2251L203.777 96.2307Z"
        fill="#1C1C1E"
      />
      <path
        d="M297.382 98.5367C297.382 96.7989 297.732 95.3897 298.282 94.1365C298.687 93.2175 298.309 92.1592 297.466 91.6189C295.894 90.6052 294.667 89.2406 294.667 86.6951V74.5472C294.667 57.793 267.852 52.9472 246.704 56.5509C228.139 59.8761 198.741 71.105 202.355 87.4415C204.16 95.6961 216.024 95.6571 224.791 89.9145C235.362 82.657 233.041 71.0716 243.612 68.3925C252.123 66.3372 257.536 72.8651 259.34 82.9967C248.253 82.0108 231.042 88.238 217.151 98.8263C203.26 109.225 192.689 123.991 194.877 135.727C198.23 153.562 217.568 147.93 233.041 140.656C246.965 134.112 256.503 126.007 263.21 118.577C267.08 122.476 273.781 122.855 281.259 120.126C287.555 117.753 294.956 112.963 299.614 107.766C300.347 106.953 300.314 105.722 299.553 104.931C298.115 103.438 297.382 101.355 297.382 98.5478V98.5367ZM260.112 103.433C250.829 114.277 238.709 123.451 236.389 113.091C235.101 105.666 242.834 94.1755 260.112 94.9943V103.433Z"
        fill="#1C1C1E"
      />
      <path
        d="M157.734 233.875C157.734 229.842 159.078 225.392 161.509 220.791C162.392 219.12 162.131 217.059 160.826 215.695C155.613 210.231 145.814 208.409 131.49 210.949C117.049 213.177 107.511 218.051 101.837 225.102C96.9404 218.045 86.6249 213.545 71.1516 210.688C62.9015 209.106 56.4557 208.777 51.2979 209.735C47.1729 202.862 34.409 198.038 22.6777 195.37C10.9409 192.931 0.236816 192.652 0.236816 200.088C0.236816 210.192 10.036 218.017 10.036 227.887C10.036 241.651 2.04119 238.531 2.04119 248.507C2.04119 260.003 10.8077 263.685 27.3136 263.434C43.8139 263.251 52.5804 261.301 52.586 254.823C52.586 253.152 52.0697 251.871 51.2979 250.518C50.7816 249.827 50.5262 249.153 50.0099 248.602C42.5314 235.518 50.7816 215.366 62.3852 218.419C69.3473 219.973 70.119 227.208 70.119 234.204C69.8636 244.608 62.3852 247.638 62.3852 255.481C62.3852 261.752 71.1517 263.462 87.6575 263.434C103.903 263.395 112.669 261.947 112.669 256.472C112.669 254.222 111.897 252.25 110.865 250.373C106.479 239.595 111.381 222.752 122.724 221.465C129.686 220.685 130.457 227.709 130.457 234.632C130.202 245.109 122.724 249.231 122.724 256.26C122.724 261.802 131.49 263.323 147.996 263.429C158.55 263.473 165.951 262.549 169.837 259.819C172.369 258.043 172.263 254.238 169.682 252.534C162.226 247.605 157.74 241.238 157.74 233.869L157.734 233.875Z"
        fill="#1C1C1E"
      />
      <path
        d="M247.331 228.895C243.723 236.776 232.891 238.954 222.575 236.637C228.427 223.642 258.252 220.98 261.483 201.469C261.722 200.02 261.35 198.533 260.501 197.336C258.502 194.523 256.786 191.593 256.786 186.859C256.786 186.853 256.786 186.842 256.786 186.837C256.786 185.16 256.142 183.545 254.888 182.436C246.582 175.067 231.558 173.045 214.325 180.297C185.96 192.25 163.009 216.106 163.014 232.799C163.014 249.464 185.966 261.022 214.325 262.359C234.44 262.765 251.973 252.116 260.223 233.824C265.381 222.183 250.685 221.938 247.331 228.9V228.895ZM212.265 232.393C205.82 228.678 201.178 222.69 201.178 213.399C201.178 194.517 224.13 184.77 224.13 194.456C224.13 202.928 213.559 221.097 212.271 232.393H212.265Z"
        fill="#1C1C1E"
      />
      <path
        d="M373.194 134.041C381.619 134.041 388.449 127.211 388.449 118.786C388.449 110.361 381.619 103.531 373.194 103.531C364.769 103.531 357.939 110.361 357.939 118.786C357.939 127.211 364.769 134.041 373.194 134.041Z"
        fill={colorStyle}
      />
      <path
        d="M425.941 37.1928C410.992 49.3069 395.334 37.1928 384.058 42.0256C363.277 50.9339 400.167 69.4111 384.058 87.1312C358.911 114.791 336.068 66.2054 376.003 38.8037C391.371 28.2522 399.249 25.5781 398.991 18.1034C398.991 11.9175 389.454 10.6288 376.825 22.7429C368.061 30.7169 342.544 30.2014 346.41 18.3451C349.761 6.74647 373.989 0.560547 392.547 0.560547C429.663 0.560547 446.046 21.2125 425.941 37.1928Z"
        fill={colorStyle}
      />
    </svg>
  );

  useEffect(() => {
    tlRef.current = gsap
      .timeline()
      .call(
        () => {
          dispatch(setShaderPosition(1));
        },
        null,
        1.5,
      )
      .to(".pageContainer", {
        opacity: 1,
        duration: 3,
        delay: 0.25,
        ease: "power2.out",
      });
    dispatch(setDistanceCircle([0.4, 0.8]));
    const urlParams = new URLSearchParams(window.location.search);
    gameIdRef.current = urlParams.get("gameId");
    dispatch(setGameId(urlParams.get("gameId")));
    currentBlufferRef.current = urlParams.get("bluffer");
    let color =
      currentBlufferRef.current != ""
        ? players[currentBlufferRef.current]?.color
        : "#373FEF";

    setColorStyle(color);
    dispatch(setCurrentBluffer({ CurrentBluffer: currentBlufferRef.current }));
    socket?.emit("connexionPhone", urlParams.get("gameId"));
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {logo}
        <div>
          <div
            className={styles.btn}
            onClick={() => {
              socket?.emit("sendActorAction", gameIdRef.current, "Launch");
            }}
          >
            <Button type="link" color={colorStyle}>
              Jouer
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
