import React, { useState, useEffect } from "react";
import styles from "./progressBar.module.scss";

const ProgressBar = ({ value, max, color= "#373fef" }) => {
  return (
    <div className={styles.progressBar}>
      <span className={styles.label}>
        Manche <span className={styles.manche}><span style={{color: color}}>{value}</span>/{max}</span> 
      </span>
      <div
        className={styles.progressBarContainer}
        style={{ width: "100%", backgroundColor: "#e0e0de" }}
      >
        <div
          className={styles.progressBarValue}
          style={{
            width: `${(value / max) * 100}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
};

const ProgressComponent = ({ value }) => {
  const maxProgress = 7;

  return <ProgressBar value={value} max={maxProgress} />;
};

export default ProgressComponent;
