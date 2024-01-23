import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../src/App.css';

const NewsItem = (props) => {
  const {
    title,
    description,
    imageUrl,
    newsUrl,
    author,
    date,
    source,
  } = props;
  const [isFav, setFav] = useState(false);

  useEffect(() => {
    fetchData();
  }, [isFav, newsUrl]);

  async function fetchData() {
    try {
      const response = await axios.post('http://localhost:8080/api/checkFav', {
        newsUrl,
      });
      if (response.data.status === 'ok') {
        setFav(true);
      }
    } catch (error) {
      console.error("Couldn't check favorites", error);
    }
  }

  const addToFav = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('proUser'));
      let userId = user._id;
      const response = await axios.post('http://localhost:8080/api/addToFav', {
        title,
        description,
        imageUrl,
        newsUrl,
        author,
        date,
        source,
        userId: userId
      });

      if (response.data.status === 'ok') {
        setFav((prevIsFav) => !prevIsFav);
        //alert('Success');
      } else {
        alert("Couldn't add to favorites");
      }
    } catch (error) {
      console.error("Couldn't add to favorites", error);
    }
  };

  return (
    <div className="my-3">
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            right: '0',
          }}
        >
          <span className="badge rounded-pill bg-danger">{source}</span>
        </div>
        <img
          className="card-img-top"
          src={
            !imageUrl
              ? 'https://thumbs.dreamstime.com/b/news-newspapers-folded-stacked-word-wooden-block-puzzle-dice-concept-newspaper-media-press-release-42301371.jpg'
              : imageUrl
          }
          alt=""
        />
        <button className="heart-btn" onClick={addToFav}>
          {isFav ? (
            <i className="fa-solid fa-heart"></i>
          ) : (
            <i className="fa-regular fa-heart"></i>
          )}
        </button>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-muted">
              By {!author ? 'Unknown' : author} on{' '}
              {new Date(date).toGMTString()}
            </small>
          </p>
          <a
            rel="noreferrer"
            href={newsUrl}
            target="_blank"
            className="btn btn-sm btn-dark"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
