import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products'; 
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Reviews from '../components/Reviews';
import Head from '../components/Head';
import ScrollingBanner from '../components/ScrollingBanner';
import Categories from '../components/Categories'; // Assurez-vous que le chemin est correct
import categoriesData from '../categories.json'; // Importation des données JSON

const Home = ({ site, products }) => {
  const [cartCount, setCartCount] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.66; // Réglez la vitesse (0.5 = 50% de la vitesse normale)
    }
  }, []);

  return (
    <div key={site.id} className="container">
      <Head title={`${site.shopName} - ${site.keywordPlurial}`} />
      
      <main>
        <Header shopName={site.shopName} cartCount={cartCount} keywordPlurial={site.keywordPlurial} />
        
        <section className="hero">
          <h1>{site.heroTitle}</h1>
          <p>{site.heroDescription}</p>
          <a href="/boutique"><button>Découvrir les équipements</button></a>
          <div className='filter'></div>
          <img src='/hero-bg.jpg' alt={site.sourceCategory} />
          <video ref={videoRef} autoPlay muted loop playsInline>
            <source src='/christopeit-sport.mp4' type='video/mp4' />
          </video>
        </section>

        <ScrollingBanner items={['Frais de ports offerts', 'Leader Allemand du fitness à domicile', 'Équipements de dernière génération', '60 jours satisfait ou remboursé', 'Frais de ports offerts', 'Boutique officielle depuis 2019', 'Support client disponible 7j/7', 'Livraison sous 2 à 5 jours ouvrés', "Guide et conseils d'installation", "+1000 avis clients positifs"]} />
        
        <section className="intro">
          <div className='wrapper'>
            <h2>{site.introTitle}</h2>
            <p>{site.introDescription}</p>
          </div>
        </section>

        {/* Passer les catégories au composant */}
        <Categories categories={categoriesData.categories} />

        <Products 
          title={`Les bestellers Christopeit France`} 
          products={products} 
          initialCategoryFilter="bestsellers" 
        />
        
        <About site={site} />
        
        <Reviews site={site} product={products[0]} />
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

export default Home;