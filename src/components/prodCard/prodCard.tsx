/* eslint-disable @next/next/no-img-element */
import styles from "./prodCard.module.css";
import Image from "next/image";
import { ProdProps, useProdutos } from "@/providers/produtos.provider";

export default function ProdCard({ prod }: { prod: ProdProps }) {
  if (prod) {
    return (
      <div className={styles.prodCardMainBox}>
        <div className={styles.prodCardImage}>
          <img alt={prod.title} src={prod.image} />
        </div>

        <div className={styles.prodCardPrice}>${prod.price}</div>
        <div className={styles.prodCardTitle}>{prod.title}</div>
      </div>
    );
  } else {
    return <div className={styles.prodCardMainBox}></div>;
  }
}
