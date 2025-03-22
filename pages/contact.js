import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

import Header from '../components/Header';
import Head from '../components/Head';
import Footer from '../components/Footer';
import About from '../components/About';
import Reviews from '../components/Reviews';

const Contact = ({ site }) => {
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
    <div key={site.id} className="container">
      <Head title={`${site.shopName} - ${site.keywordPlurial}`}/>
      
      <main>
      <Header shopName={site.shopName} cartCount={cartCount} keywordPlurial={site.keywordPlurial}/>
      <section className="contact" id="contact">
        <div className="wrapper">
          <div className="contact-content">
            <h2>À Votre disposition 7j/7</h2>
            <p>{site.contactDescription}</p>
            <br></br>
            <p><i className="fas fa-map-marker-alt"></i> 125 rue de L'Artisanat 42110 Civens, France</p>
            <p><i className="fas fa-envelope"></i> suppor@christopeit-france.shop</p>
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
        
      <About site={site}/>
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>

  );
};

export async function getStaticProps() {
  const content = await import('../content.json');
  const productsData = await import('../products.json');

  return {
    props: {
      site: content.sites[0],
      products: productsData.products,
    },
  };
}

export default Contact;