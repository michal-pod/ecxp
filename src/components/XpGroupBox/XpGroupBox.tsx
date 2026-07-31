import type { ReactNode } from "react";
import styles from "./XpGroupBox.module.css";

type XpGroupBoxProps = {
  title: string;
  children: ReactNode;
};

export function XpGroupBox({ title, children }: XpGroupBoxProps) {
  return (
    <fieldset className={styles.group}>
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
