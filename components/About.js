import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import content from '../content.json';


const About = ({ site }) => {
  return (
    <>
      <section className="about" id='a-propos'>
          <div className='wrapper'>
            <div className="about-content">
              <h2>{site.aboutTitle}</h2>
              <p>{site.aboutDescription}</p>
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