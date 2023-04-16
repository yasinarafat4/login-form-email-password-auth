import React, { useState } from "react";
import "./Register.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";

const auth = getAuth(app);

const Register = () => {
  const [error, setError] = useState("");

  //state for success message
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    //1. Prevent page refresh
    event.preventDefault();
    setSuccess("");
    setError("");
    //2. collect form data
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log("Name:", name, "Email:", email, "Password:", password);
    // validation using regular expression
    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Please add at least one uppercase");
      return;
    } else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError("Please add at least two numbers");
      return;
    } else if (password.length < 6) {
      setError("Please add at least 6 characters");
      return;
    }
    //3. create user in firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);

        // if successful then error message will be gone
        setError("");

        // reset the input fields
        event.target.reset();

        // success message
        setSuccess("User has been created successfully");

        sendVerificationEmail(result.user);
        updateUserData(result.user, name);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };

  const sendVerificationEmail = (user) => {
    sendEmailVerification(user).then((res) => {
      console.log(res);
      alert("Please verify your email address");
    });
  };

  const updateUserData = (user, name) => {
    updateProfile(user, {
      displayName: name,
    })
      .then(() => {
        console.log("user name updated");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  const handleEmailChange = (event) => {
    console.log(event.target.value);
    // setEmail(event.target.value);
  };

  const handlePasswordBlur = (event) => {
    console.log(event.target.value);
  };

  return (
    <>
      <div className="register-container">
        <h3 className="center">Please Register</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            required
          />
          <br />
          <input
            onChange={handleEmailChange}
            className="input-field"
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            required
          />
          <br />
          <p className="text-danger">{error}</p>
          <p className="text-success">{success}</p>
          <input
            onBlur={handlePasswordBlur}
            className="input-field"
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            required
          />{" "}
          <br />
          <input className="btn-register" type="submit" value="Register" />
        </form>
      </div>
      <p>
        {" "}
        <small>
          Already have an account? Please <Link to="/login">Login</Link>
        </small>{" "}
      </p>
    </>
  );
};

export default Register;
