import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './slides.css';

const Slides = () => {
  const [latestData, setLatestData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achievementsResponse, newsResponse, postersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/achievements'),
          axios.get('http://localhost:5000/api/news'),
          axios.get('http://localhost:5000/api/posters')
        ]);

        const data = [];

        if (achievementsResponse.data && achievementsResponse.data.length > 0) {
          const latest = achievementsResponse.data[achievementsResponse.data.length - 1];
          data.push({
            type: 'achievement',
            title: latest.title,
            image: `data:image/jpeg;base64,${latest.image}`,
            link: './latestachivements'
          });
        }

        if (newsResponse.data && newsResponse.data.length > 0) {
          const latestNews = newsResponse.data[newsResponse.data.length - 1];
          const title = latestNews.items.find(item => item.type === 'title')?.value || 'No Title';
          const imageItem = latestNews.items.find(item => item.type === 'image');
          data.push({
            type: 'news',
            title: title,
            date: new Date(latestNews.createdAt).toLocaleDateString(),
            image: imageItem ? imageItem.value : null,
            link: './news'
          });
        }

        if (postersResponse.data && postersResponse.data.length > 0) {
          const latestPoster = postersResponse.data[0];
          data.push({
            type: 'poster',
            title: 'Latest Poster',
            image: `data:${latestPoster.contentType};base64,${latestPoster.data}`,
            link: '#'
          });
        }

        setLatestData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1 className="headingg">Latest Updates</h1>
      <div className="containerr">
        <div className="left-side">
          <Slider {...settings}>
            {latestData.map((item, index) => (
              <div key={index} className="cardd" onClick={() => window.location.href = item.link}>
                <img src={item.image} alt={item.title} />
                <div className="cardd-body">
                  <h3>{item.title}</h3>
                  {item.type === 'news' && <p className="date">{item.date}</p>}
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="right-side">
          <div className="text-contentt">
            <p>"Explore Khub's vibrant ecosystem where ideas thrive and partnerships flourish. With our image slider, you can immerse yourself in the latest updates on sessions, events, and breaking news."</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slides;