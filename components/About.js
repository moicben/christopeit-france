import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import content from '../content.json';


const About = ({ site }) => {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <>
      <section className="about" id='a-propos'>
          <div className='wrapper'>
            <div className="about-content">
              <h2>{site.aboutTitle}</h2>
              <p>{site.aboutDescription}</p>
              <div className='row'></div>
              <button onClick={() => handleNavigation('/a-propos')}>En savoir plus</button>
              <button className='phantom' onClick={() => handleNavigation('/contact')}>Nous contacter</button>
            </div>
            <div className="about-image">
              <img src="/christopeit-sport.jpg" alt="Chirstopeit Sport fitness" />
            </div>
          </div>
        </section>
    </>
  );
};

export default About;