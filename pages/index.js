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
import Categories from '../components/Categories';

import { fetchData }  from '../lib/supabase'; // Assurez-vous que le chemin est correct
import { da } from 'date-fns/locale';

const Home = ({ data, shop, brand, products, categories }) => {
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

  console.log('Shop logo:', shop.logo);

  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorMain={brand.colorMain} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${shop.name} - ${data.heroTitle}`}
      />
      
      <main>
        <Header title={shop.name} name={shop.name} domain={shop.domain} logo={brand.logo} />
        
        <section className="hero">
          <h1>{data.heroTitle}</h1>
          <p>{data.heroDesc}</p>
          <a href="/boutique"><button>Découvrir les équipements</button></a>
          <div className='filter'></div>
          <video ref={videoRef} autoPlay muted loop playsInline>
            <source src={data.heroMedia} type='video/mp4' />
          </video>
        </section>

        <ScrollingBanner items={data.saleBanner} />
        
        <section className="intro">
          <div className='wrapper'>
            <h2>{data.introTitle}</h2>
            <p>{data.introDesc}</p>
          </div>
        </section>

        <Categories categories={categories} />

        <Products 
          title={`Les bestellers Christopeit France`} 
          products={products} 
          categories={categories}
          initialCategoryFilter="bestsellers" 
        />
        
        <About data={data} />
        
        <Reviews data={data} />
      </main>

      <Footer shop={shop} />
    </div>
  );
};

export async function getStaticProps() {

  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  

  return {
    props: {
      data: data[0],
      shop: shop[0],
      brand: brand[0],
      products: products,
      categories: categories,
    },
  };
}

export default Home;