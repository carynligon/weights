import React, { useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase";
import styles from "../styles/Signup.module.scss";

const SignupPage = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccessful, setSignupStatus] = useState(undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      setSignupStatus(true);
      push("/");
    } catch (e) {
      setSignupStatus(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@email.com"
        ></input>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
      </div>
      <button>Submit</button>
    </form>
  );
};

export default SignupPage;
