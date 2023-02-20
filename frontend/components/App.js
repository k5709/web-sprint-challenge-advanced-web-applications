import React, { useState, useEffect } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import ProtectedRoute from "./ProtectedRoute";
import { axiosWithAuth } from "../axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();

  const redirectToLogin = () => {
    return navigate("/");
  };

  const redirectToArticles = () => {
    return navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    setSpinnerOn(true);
    setMessage("");
    axios
      .post(`http://localhost:9000/api/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch((err) => console.log(err.response));
  };

  const getArticles = () => {
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    const headers = {
      authorization: token,
    };
    {
      axios
        .get(articlesUrl, { headers })
        .then((res) => {
          setArticles(res.data.articles);
          setSpinnerOn(false);
          setMessage(res.data.message);
        })
        .catch((err) => {
          console.log(err.response);
        });
      // return getArticles();
    }
  };

  // useEffect(() => {
  //   if (localStorage.getItem("token") === null) {
  //     console.log("logic worked");
  //   } else {
  //     getArticles();
  //     console.log("articles mounted");
  //   }
  // }, []);

  const postArticle = (article) => {
    //   // ✨ implement
    //   // The flow is very similar to the `getArticles` function.
    //   // You'll know what to do! Use log statements or breakpoints
    //   // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    const headers = {
      authorization: token,
    };
    axios
      .post(`http://localhost:9000/api/articles`, article, {
        headers,
      })
      .then((res) => {
        console.log(res);
        setArticles(res.data.article);
        setSpinnerOn(false);
        setMessage(res.data.message);
        redirectToArticles();
        window.location.href = "/articles";
      })
      .catch((err) => console.log(err.response));
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    const headers = {
      authorization: token,
    };
    axios
      .delete(
        `http://localhost:9000/api/articles/${article_id}`,
        { headers },
        article_id
      )
      .then((res) => {
        console.log(res.data);
        setMessage(res.data.message);
        getArticles();
        setCurrentArticleId(null);
        setSpinnerOn(false);
      })
      .catch((err) => console.log(err.response));
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />

      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            // authenticated={authenticated}
            element={
              <ProtectedRoute>
                <>
                  <ArticleForm
                    postArticle={postArticle}
                    updateArticle={updateArticle}
                    deleteArticle={deleteArticle}
                  />
                  <Articles
                    articles={articles}
                    getArticles={getArticles}
                    deleteArticle={deleteArticle}
                    setCurrentArticleId={setCurrentArticleId}
                  />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
