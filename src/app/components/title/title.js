import styles from "./title.module.scss";

export default function Title({ title }) {
  return (
    <div className={styles.title}>
      <h1>{title}</h1>
    </div>
  );
}