import React from 'react';

const About = ({ data }) => {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <>
      <section className="about" id='a-propos'>
          <div className='wrapper'>
            <div className="about-content">
              <h2>{data.aboutTitle}</h2>
              <p>{data.aboutDesc}</p>
              <div className='row'></div>
              <button onClick={() => handleNavigation('/a-propos')}>En savoir plus</button>
              {/* <button className='phantom' onClick={() => handleNavigation('/contact')}>Nous contacter</button> */}
            </div>
            <div className="about-image">
              <img src={data.aboutImg} alt="Chirstopeit Sport fitness" />
            </div>
          </div>
        </section>
    </>
  );
};

export default About;