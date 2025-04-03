import React, { useState } from 'react';
import styles from './Footer.module.css';

const Footer = ({ shop,data }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);

  };

  return (
    <>
      <section className="features">
        <div className='wrapper'>
          <div className='feature-item'>
            <img src="/delivery.png" alt="livraison gratuite" />
            <p>{data.footerDeliveryLabel}</p>
          </div>
          <div className='feature-item'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 38">
              <path d="M32.5 13.5c-1.8-4.1-5.1-7.2-9.3-8.8-4-1.7-8.6-1.5-12.7.3C4.8 7.6 1.1 13.1.7 19.4c-.1.3 0 .6.1.9 0 0 0 .1.1.1v.1c.3.5.8.8 1.4.8.9.1 1.7-.7 1.8-1.6.3-5 3.2-9.4 7.8-11.4 6.6-3.1 14.5-.1 17.5 6.7 3 6.7 0 14.7-6.6 17.7-2.7 1.2-5.8 1.5-8.6.8l.2-.3c.2-.3.2-.8-.1-1.1-.2-.3-.5-.5-.9-.5l-4.7.1c-.4 0-.7.2-.9.6-.2.3-.2.7 0 1l2.5 4.1c.2.3.6.6 1 .5.4 0 .7-.2.9-.5l.4-.7c1.6.5 3.4.8 5 .7 2.3 0 4.5-.5 6.6-1.4 4.1-1.9 7.2-5.2 8.7-9.4 1.7-4.4 1.5-9-.4-13.1"></path>
            </svg>
            <p>{data.footerReturnLabel}</p>
          </div>
          <div className='feature-item'>
            <img src="/guarantee.png" alt="livraison gratuite" />
            <p>{data.footerGuarenteeLabel}</p>
          </div>
          <div className='feature-item'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 38">
              <path d="M30.1 4.3c-.4-.3-1-.3-1.4-.1-6.4 3-9.1-.8-9.2-1-.3-.4-.7-.7-1.2-.7s-1 .3-1.2.7c-.1.2-2.8 4-9.2 1-.5-.2-1-.2-1.5.1-.4.3-.7.7-.7 1.3V20.3c.1.5 2.3 12.3 11.9 16.6.2.1.4.1.6.1.2 0 .4 0 .6-.1 9.6-4.2 11.8-16.1 11.9-16.6V5.6c.1-.6-.1-1-.6-1.3zm-2.2 15.6c-.2 1.1-2.4 10.4-9.6 14-7.2-3.6-9.4-12.9-9.6-14V7.7c4.5 1.4 7.8.1 9.6-1.5 1.8 1.6 5.1 2.9 9.6 1.5v12.2z"></path>
            </svg>
            <p>{data.footerSecureLabel}</p>
          </div>
        </div>
      </section>
      <footer>
        <div className="wrapper">
          <article>
            <div className="footer-column">
              <a href="/"><h4>{shop.name}</h4></a>
              <p>{data.footerText}</p>
              <a className='mail' href={`mailto:support@${shop.domain}`}>support@{shop.domain}</a>
              
            </div>
            <div className="footer-column">
              <h4>{data.footerColumnLabel1}</h4>
              <ul>
                <li><a href="/all">{data.footerLink1}</a></li>
                <li><a href="/about">{data.footerLink2}</a></li>
                <li><a href="/contact">{data.footerLink3}</a></li>
                <li><a href="/help">{data.footerLink4}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{data.footerColumnLabel2}</h4>
              <ul>
                <li><a href="/returns">{data.footerLink5}</a></li>
                <li><a href="/follow-order">{data.footerLink6}</a></li>
                <li><a href="/blog">{data.footerLink8}</a></li>
                <li><a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // Empêche le comportement par défaut du lien
                        const badgeImage = document.querySelector("section.badge-container > img");
                        if (badgeImage) {
                          badgeImage.click(); // Simule un clic sur l'image
                        }
                      }}
                    >{data.footerLink7}</a></li>
                
              </ul>
            </div>
            <div className="footer-column">
              <h4>{data.footerColumnLabel3}</h4>
              {submitted ? (
                <p>Thank you for your registration</p>
              ) : (
                <form onSubmit={handleSubmit}> 
                  <label htmlFor="email">{data.footerNewsletter}</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder={data.footerNewsletterInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <button type="submit">{data.footerNewsletterCta}</button>
                </form>
              )}
            </div>
          </article>
          <div className="sub-footer">
            <div className="legal-container">
                <a href="/cgv">{data.footerLegal1}</a>
                <a href="/legals">{data.footerLegal2}</a>
                <a href="/confidentiality">{data.footerLegal3}</a>
              </div>
            <p>© 2025 - {data.footerCopyright} - {shop.name}</p>
            <div className={styles.paymentIcons}>
              <img src="/card-logo.png" alt={"acheter" + shop.name} />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};


export default Footer;
