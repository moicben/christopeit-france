import React from 'react';
import Head from '../components/Head';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase';


const PolitiqueDesRetours = ({shop, brand, categories, data}) => {
  return (

    <div className="container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.returnsPageLabel} - ${shop.name}`}
      />
      
      <main >
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} />

    
      <section className='legal'> 
        <h1>{data.returnsPageLabel}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.returnsPageContent }}></div>
      </section>
      </main>
      <Footer shop={shop} data={data} />
    </div>
  );
};

export default PolitiqueDesRetours;


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
