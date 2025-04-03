import React from 'react';

const About = ({ data,shop }) => {
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
              <button className='bg-primary' onClick={() => handleNavigation('/about')}>{data.aboutCta}</button>
              {/* <button className='phantom' onClick={() => handleNavigation('/contact')}>Nous contacter</button> */}
            </div>
            <div className="about-image">
              <img src={data.aboutImg} alt={shop.name} />
            </div>
          </div>
        </section>
    </>
  );
};

export default About;