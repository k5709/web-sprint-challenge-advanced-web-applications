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
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = () => {
    return navigate("/");
  };

  const redirectToArticles = () => {
    return navigate("/articles");
  };

  const logout = () => {
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
          setMessage(res.data.message);
          setArticles(res.data.articles);
          setSpinnerOn(false);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const postArticle = (article) => {
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
        const postArt = res.data.article;
        setArticles((article) => article.concat(postArt));
        setSpinnerOn(false);
        setMessage(res.data.message);
        redirectToArticles();
      })
      .catch((err) => console.log(err.response));
  };

  const updateArticle = ({ article_id, article }) => {
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    const headers = { authorization: token };
    axios
      .put(`http://localhost:9000/api/articles/${article_id}`, article, {
        headers,
      })
      .then((res) => {
        setMessage(res.data.message);
        setArticles(articles.concat(res.data.article));
        setCurrentArticleId(null);
        setSpinnerOn(false);
      })
      .catch((err) => console.log(err.response));
  };

  const deleteArticle = (article_id) => {
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    const headers = {
      authorization: token,
    };
    axios
      .delete(`http://localhost:9000/api/articles/${article_id}`, { headers })
      .then((res) => {
        console.log(res.data);
        setMessage(res.data.message);
        setArticles(res.data.article);
        setSpinnerOn(false);
        window.location.href = "/articles";
      })
      .catch((err) => console.log(err.response));
  };

  return (
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
            element={
              <ProtectedRoute>
                <>
                  <ArticleForm
                    postArticle={postArticle}
                    updateArticle={updateArticle}
                    deleteArticle={deleteArticle}
                    setCurrentArticleId={setCurrentArticleId}
                    currentArticleId={currentArticleId}
                    currentArticle={articles?.find(
                      (updated) => updated.article_id === currentArticleId
                    )}
                    articles={articles}
                  />
                  <Articles
                    articles={articles}
                    getArticles={getArticles}
                    updateArticle={updateArticle}
                    deleteArticle={deleteArticle}
                    setCurrentArticleId={setCurrentArticleId}
                    currentArticleId={currentArticleId}
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
