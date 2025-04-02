import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

import Header from '../components/Header';
import Head from '../components/Head';
import Footer from '../components/Footer';
import About from '../components/About';
import Reviews from '../components/Reviews';
import Testimonials from '../components/Testimonials';

import { fetchData } from '../lib/supabase';

const Contact = ({ shop,brand, data }) => {
  const [cartCount, setCartCount] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  
  useEffect(() => {
    emailjs.init("8SL7vzVHt7qSqEd4i");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());

    emailjs.send('gmail-benedikt', 'new-contact', formObject)
      .then(() => {
        setFormSubmitted(true);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });

    e.target.reset();
  };

  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`Contact - ${shop.name}`}
      />
      
      <main>
      <Header title={shop.name} name={shop.name} domain={shop.domain} logo={brand.logo} />
      <section className="contact" id="contact">
        <div className="wrapper">
          <div className="contact-content">
            <h2>À Votre disposition 7j/7</h2>
            <p>Pour toute question ou suggestion, n'hésitez pas à nous contacter. Notre équipe est à votre écoute et se fera un plaisir de vous répondre rapidement.</p>
            <br></br>
            <p><i className="fas fa-map-marker-alt"></i> 125 rue de L'Artisanat 42110 Civens, France</p>
            <p><i className="fas fa-envelope"></i> suppor@{shop.domain}</p>
            <p><i className="fas fa-phone"></i> +44 7446 162 797</p>
          </div>
          <div className="contact-form">
            {formSubmitted ? (
              <p className="confirmation">
                Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nom complet</label>
                <input
                  placeholder="Paul Dupont"
                  type="text"
                  id="name"
                  name="name"
                  required
                />

                <div className="row-form">
                  <label htmlFor="email">
                    <span>Email</span>
                    <input
                      placeholder="exemple@gmail.com"
                      type="email"
                      id="email"
                      name="email"
                      required
                    />
                  </label>
                  <label htmlFor="phone">
                    <span>Téléphone</span>
                    <input
                      placeholder="07 12 34 56 78"
                      type="text"
                      id="phone"
                      name="phone"
                      required
                    />
                  </label>
                </div>

                <label htmlFor="message">Votre demande</label>
                <textarea
                  placeholder="Écrivez votre demande ici..."
                  id="message"
                  name="message"
                  required
                ></textarea>

                <button type="submit">Envoyer</button>
              </form>
            )}
          </div>
        </div>
      </section>
        
      <Testimonials shop={shop} data={data.reviewContent} />
      <About data={data}/>
      </main>
      <Footer shop={shop} />
    </div>

  );
};

export async function getStaticProps() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      shop: shop[0],
      brand: brand[0],
      data: data[0],
    },
  };
}

export default Contact;