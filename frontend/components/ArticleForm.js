import React, { useEffect, useState } from "react";
import axios from "axios";
import PT from "prop-types";
import { Navigate } from "react-router-dom";

const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues);

  const {
    postArticle,
    updateArticle,
    currentArticleId,
    currentArticle,
    setCurrentArticleId,
  } = props;

  useEffect(() => {
    if (currentArticle) {
      setValues(currentArticle);
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (currentArticle) {
      updateArticle({
        article_id: currentArticle.article_id,
        article: {
          title: values.title,
          text: values.text,
          topic: values.topic,
        },
      });
      setCurrentArticleId(null);
      setValues(initialFormValues);
    } else postArticle(values);
    setValues(initialFormValues);
  };

  const isDisabled = () => {
    return values.title.trim().length >= 1 && values.text.trim().length >= 1;
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={!isDisabled()} id="submitArticle">
          Submit
        </button>
        {currentArticle ? (
          <button onClick={() => setCurrentArticleId(null)}>Cancel edit</button>
        ) : (
          ""
        )}
      </div>
    </form>
  );
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
