import React, { useState, useEffect, useCallback } from 'react';

import { CITIES, CITY_IMAGES } from '../constants';

import './css/aroundWorld.css';

const AroundWorld = () => {
  const OPEN_WEATHER_API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  const [weatherReport, setWeatherReport] = useState({});
  const [temperature, setTemperature] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [active, setActive] = useState(0);

  const handleChangeLocation = useCallback(
    loc => {
      let city = Object.values(loc);
      let state = Object.keys(loc);

      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}&key=${GOOGLE_API_KEY}`,
      )
        .then(res => res.json())
        .then(data => {
          let geoLocation = data.results[0].geometry.location;
          let lon = geoLocation.lng;
          let lat = geoLocation.lat;
          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`,
          )
            .then(res => res.json())
            .then(data => {
              setWeatherReport(data);
              setTemperature(data.current.temp);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    [OPEN_WEATHER_API_KEY, GOOGLE_API_KEY],
  );

  useEffect(() => {
    handleChangeLocation({ 'New York': 'New York' });
  }, [handleChangeLocation]);

  const displayCities = () => {
    return CITIES.map((val, i) => {
      return (
        <li
          className={
            active === i ? 'around-world-city-active' : 'around-world-city'
          }
          key={Object.values(val)}
          onClick={() => {
            setCurrentCity(Object.values(val));
            setActive(i);
            handleChangeLocation(val);
          }}
        >
          {Object.values(val)}
        </li>
      );
    });
  };

  return (
    <div className='around-world-grid-container'>
      <div className='around-world-image'>
        <img
          className='around-world-img'
          src={CITY_IMAGES[currentCity ? currentCity : 'New York']}
          alt='city'
        />
        <div className='around-world-weather'>
          <div className='around-world-description'>
            {weatherReport?.current?.weather[0].description.replace(
              /^./,
              weatherReport?.current?.weather[0].description[0].toUpperCase(),
            )}
          </div>
          <div className='around-world-temp'>
            {Math.round(temperature) + '\xB0F'}
          </div>
        </div>
      </div>
      <div className='around-world-title'>
        <div className='around-world-title-text'>Around the World</div>
        <div className='around-world-line'></div>
      </div>
      <div className='around-world-locations'>
        <ul className='around-world-list'>{displayCities()}</ul>
      </div>
    </div>
  );
};

export default AroundWorld;
