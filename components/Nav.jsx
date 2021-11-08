import React, { useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import { Flex, Link, Text, Box } from "rebass";
import Logo from "./Logo";
import SideSheet from "./SideSheet";
import styles from "../styles/Nav.module.scss";

const Nav = ({ userAuthed }) => {
  const { pathname, push } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSideSheet = () => {
    console.log("toggle");
    setSideSheetOpen(!sideSheetOpen);
  };

  const userSignOut = async () => {
    try {
      await firebase.auth().signOut();
      sessionStorage.removeItem("uid");
      push("/login");
    } catch (e) {
      console.error("error logging user out!", e);
    }
  };

  return (
    <div className={styles.container}>
      <Box mx="auto" />
      <div
        className={menuOpen ? styles.menuButtonOpen : styles.menuButton}
        onClick={toggleSideSheet}
      ></div>
      <div className={menuOpen ? styles.menu : styles.menuHidden}></div>
      <SideSheet
        sideSheetOpen={sideSheetOpen}
        toggleSideSheet={toggleSideSheet}
      >
        <div className={styles.navMenu}>
          {userAuthed && (
            <Link
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
                marginBottom: "8px",
                textDecoration: "underline",
              }}
              fontWeight="bold"
              onClick={userSignOut}
            >
              Sign out
            </Link>
          )}
          <Link
            fontWeight="bold"
            sx={{ textDecoration: "underline" }}
            variant="nav"
            href={pathname.includes("history") ? "/" : "/history"}
          >
            {pathname.includes("history") ? "Log" : "History"}
          </Link>
        </div>
      </SideSheet>
    </div>
  );
};

export default Nav;
