import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PT from "prop-types";

export default function Articles(props) {
  const {
    articles,
    getArticles,
    deleteArticle,
    setCurrentArticleId,
    currentArticleId,
    setCurrentArticle,
    currentArticle,
  } = props;

  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/");
  };

  const editArt = (article_id) => {
    setCurrentArticleId(article_id);
    console.log(currentArticleId);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      redirectToLogin();
    } else {
      getArticles();
    }
  }, [currentArticle]);

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {!articles
        ? "No articles yet"
        : articles.map((art) => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p> {art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button
                    // onClick={() => editArt(art.article_id)}
                    onClick={() => editArt(art.article_id)}
                    disabled={currentArticleId ? true : false}
                  >
                    Edit
                  </button>
                  <button
                    disabled={false}
                    onClick={() => deleteArticle(art.article_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
    </div>
  );
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(
    PT.shape({
      // the array can be empty
      article_id: PT.number.isRequired,
      title: PT.string.isRequired,
      text: PT.string.isRequired,
      topic: PT.string.isRequired,
    })
  ).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
};
