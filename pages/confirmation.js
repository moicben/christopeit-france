import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import Head from '../components/Head';
import { fetchData } from '../lib/supabase';

const Confirmation = ({brand, shop}) =>{
  const router = useRouter();
  const { commande: orderId } = router.query;

  useEffect(() => {
    // Vider le panier à l'arrivée sur la page
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="confirmation-container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorMain={brand.colorMain} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`Confirmation - ${shop.name}`}
      />

      <img src={brand.logo} alt="Logo" className="logo" />
      <h2>Commande #{orderId} confirmée</h2>
      <p>
        Merci pour votre commande <strong>#{orderId}</strong> sur notre boutique,
        <br />
        Comptez 2 jours ouvrés pour son traitement et son expédition.
        <br />
        Vous recevrez sous peu, un suivi de livraison par mail.
      </p>
      <a href="/"><button type="button">Retourner à la boutique</button></a>
    </div>
  );
}


export async function getStaticProps() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
    const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      brand: brand[0],
      shop: shop[0],
    },
  };
}

export default Confirmation;