import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";

const auth = getAuth(app);

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef();
  const handleLogin = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log("Email:", email, "Password:", password);

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;

        if (!loggedUser.emailVerified) {
        }

        setSuccess("User login successful");
        setError("");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  const handleResetPassword = (event) => {
    const email = emailRef.current.value;
    if (!email) {
      alert("Please provide your email to reset password ");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Please check your email");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <div className="w-50 mx-auto">
      <h2>Please Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            ref={emailRef}
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <p>
        <small>
          Forget Password? Please{" "}
          <button onClick={handleResetPassword} className="btn btn-link">
            Reset Password
          </button>
        </small>
      </p>
      <p>
        {" "}
        <small>
          New to this website? Please <Link to="/register">Register</Link>
        </small>{" "}
      </p>

      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </div>
  );
};

export default Login;
