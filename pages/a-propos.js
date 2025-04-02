import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from '../components/Head';
import Footer from '../components/Footer';
import Header from '../components/Header';

import { fetchData } from '../lib/supabase'; // Assurez-vous que le chemin est correct

const APropos = ({ data, shop, brand }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Vérifiez la taille initiale de l'écran
    handleResize();

    // Ajoutez un écouteur d'événements pour les redimensionnements
    window.addEventListener('resize', handleResize);

    // Nettoyez l'écouteur d'événements
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container">

      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`Notre histoire - ${shop.name}`}
      />
      <main>
        <Header title={shop.name} name={shop.name} domain={shop.domain} logo={brand.logo} />

        <section
          className="a-propos"
          id="about"
          style={{
            backgroundImage: `url(${isMobile ? data.aboutPageImgMobile : data.aboutPageImg})`,
          }}
        >
          {/* <div className='about-banner'>
            <div className='filter'>
              <h1>Il était une fois...</h1>
            </div>
          </div>
          <div className="wrapper">
          </div> */}
        </section>
      </main>
      <Footer shop={shop} />
    </div>
  );
};

export async function getStaticProps() {
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      data: data[0],
      shop: shop[0],
      brand: brand[0],
    },
  };
}

export default APropos;