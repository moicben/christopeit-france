
import React from 'react';
import Head from '../components/Head';
import { FaShoppingCart } from 'react-icons/fa';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase';

export default function ConditionsGenerales({shop, brand, categories, data}) {
  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.cgvPageLabel} - ${shop.name}`}
      />

      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        
        <section className='legal'>
          <h1>{data.cgvPageLabel}</h1>
          <div dangerouslySetInnerHTML={{ __html: data.cgvPageContent }}></div>
        </section>
      </main>
      <Footer shop={shop} data={data} />
    </div>
  )
}


export async function getStaticProps() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      shop: shop[0],
      brand: brand[0],
      categories: categories,
      data: data[0],
    },
  };
}