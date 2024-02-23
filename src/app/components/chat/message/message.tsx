"use client";

import { useEffect, useState } from "react";
import styles from "./message.module.scss";

export default function Message ({message}) {

    
    return (
           <p className={`${styles.message} ${message.send && styles.send}`}>{message.content}</p>
    );
}