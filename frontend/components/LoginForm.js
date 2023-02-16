import React, { useState } from "react";
import PT from "prop-types";
import axios from "axios";

const initialFormValues = {
  username: "",
  password: "",
};
export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues);
  // ✨ where are my props? Destructure them here
  const { spinner, spinnerOn } = props;

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    console.log("submit button clicked");
    evt.preventDefault();
    // ✨ implement
    const payload = {
      username: values.username,
      password: values.password,
    };
    axios
      .post(`http://localhost:9000/api/login`, payload)
      .then((res) => {
        console.log(res.data);
        const token = res.data.token;
        localStorage.setItem("token", token);
      })
      .catch((err) => console.log(err.response));
  };

  const isDisabled = () => {
    return (
      values.username.trim().length >= 3 && values.password.trim().length >= 8
    );
  };

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={!isDisabled()} id="submitCredentials">
        Submit credentials
      </button>
    </form>
  );
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
};
