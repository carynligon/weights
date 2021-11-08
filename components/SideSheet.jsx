import React, { useState } from "react";
import styles from "../styles/SideSheet.module.scss";

const SideSheet = ({ children, sideSheetOpen, toggleSideSheet }) => {
  return (
    <div className={sideSheetOpen ? styles.container : styles.containerHidden}>
      <div className={sideSheetOpen ? styles.content : styles.contentHidden}>
        <div className={styles.close} onClick={toggleSideSheet}>
          X
        </div>
        {children}
      </div>
    </div>
  );
};

export default SideSheet;
