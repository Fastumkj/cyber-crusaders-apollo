import React, { useEffect } from 'react';
import '../styles/Stars.css';

const Stars = () => {
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement('div');
      star.classList.add('star');

      const startX = Math.random() * window.innerWidth;
      const endX = startX - Math.random() * 200 + 100;
      const duration = Math.random() * 5 + 2;

      star.style.left = `${startX}px`;
      star.style.animationDuration = `${duration}s`;

      setTimeout(() => {
        star.style.opacity = '0';
      }, duration * 1000);

      star.addEventListener('animationend', () => {
        star.parentNode.removeChild(star);
      });

      document.querySelector('.stars-container').appendChild(star);

      requestAnimationFrame(() => {
        star.style.transform = `translate(${endX}px, ${window.innerHeight}px)`;
      });
    };

    const starInterval = setInterval(createStar, 200);

    return () => {
      clearInterval(starInterval);
    };
  }, []);

  return <div className="stars-container" />;
};

export default Stars;
