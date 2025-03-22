import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import content from '../content.json';


const Testimonials = ({ site }) => {
  return (
    <>
      <section className="testimonials">
        <div className='wrapper'>
            <h2>Nos sportifs témoignent !</h2>
            <div className='testimonials-content'>
                <blockquote className="testimonial">
                <h4>{site.testimonial1}</h4>
                <p>{site.author1}</p>
                </blockquote>
                <blockquote className="testimonial">
                <h4>{site.testimonial2}</h4>
                <p>{site.author2}</p>
                </blockquote>
                <blockquote className="testimonial">
                <h4>{site.testimonial3}</h4>
                <p>{site.author3}</p>
                </blockquote>
            </div>
            </div>
        </section>
    </>
  );
};

export default Testimonials;