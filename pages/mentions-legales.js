import Head from 'next/head'
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase';

export default function Mentions({shop, brand}) {
  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`Mentions Légales - ${shop.name}`}
      />
      
      <main>
        <Header title={shop.name} name={shop.name} domain={shop.domain} logo={brand.logo} />
        
        <section className='legal'>
          <h1>Mentions Légales</h1>
          <h2>1. Informations sur l’éditeur du site</h2>
          <p>
            Le site <strong>{shop.name}</strong> accessible à l’adresse<br></br>
             <a href="/"> www.{shop.domain}</a> <br></br> édité par :
          </p>
          <ul>
            <li><strong>Nom de la société</strong> : {shop.name} SAS</li>
            <li><strong>Forme juridique</strong> : Société à actions simplifiés</li>
            <li><strong>Adresse du siège social</strong> : 125 RUE DE L'ARTISANAT 42110 CIVENS</li>
            <li><strong>Numéro de SIRET</strong> : 851 990 135</li>
            <li><strong>Numéro de TVA intracommunautaire</strong> : FR47851990135</li>
            <li><strong>Responsable de la publication</strong> : Veronique BERENGÈRE</li>
            <li><strong>Contact email</strong> : support@{shop.domain}</li>
          </ul>
          <h2>2. Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul>
            <li><strong>Nom de l’hébergeur</strong> : Hostinger</li>
            <li><strong>Adresse</strong> : Hostinger International Ltd, 61 Lordou Vironos Street, 6023 Larnaca, Chypre</li>
            <li><strong>Site web</strong> : <a href="https://www.hostinger.fr/">https://www.hostinger.fr</a></li>
          </ul>
          <h2>3. Propriété intellectuelle</h2>
          <p>
            L’ensemble du contenu présent sur le site <strong>{shop.name} </strong> 
             (textes, images, logos, graphismes, vidéos, etc.) est protégé par les lois en vigueur sur la propriété intellectuelle.
          </p>
          <ul>
            <li>
              <strong>Propriété exclusive</strong> : Toute reproduction ou utilisation est interdite sans autorisation de 
              <strong>{shop.name}</strong>.
            </li>
          </ul>
          <h2>4. Protection des données personnelles</h2>
          <p>
            Conformément au RGPD, les informations collectées via le site <strong>{shop.name}</strong> 
            sont utilisées uniquement dans le cadre de la gestion des commandes et des relations clients.
          </p>
          <h3>Droits des utilisateurs</h3>
          <p>Vous disposez des droits suivants concernant vos données personnelles :</p>
          <ul>
            <li>Droit d’accès, de rectification et de suppression.</li>
            <li>Droit à la portabilité des données.</li>
            <li>Droit de limiter ou de vous opposer au traitement des données.</li>
          </ul>
          <p>Pour exercer ces droits, contactez-nous à : support@{shop.domain}</p>
          <h2>5. Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer l’expérience utilisateur. 
            Vous pouvez modifier vos préférences via les paramètres de votre navigateur.
          </p>
        </section>
      </main>
      <Footer shop={shop} />
    </div>
  )
}


export async function getStaticProps() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      shop: shop[0],
      brand: brand[0],
    },
  };
}