import React, { useState } from 'react';
import Link from 'next/link';
import Head from '../components/Head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Pagination from '../components/Pagination'; // Import du composant Pagination

import { fetchData } from 'lib/supabase';

const Blog = ({ shop, data, brand }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // Assurez-vous que data.blogContent est un tableau
  const blogContentArray = Array.isArray(data.blogContent) ? data.blogContent : Object.values(data.blogContent);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

  const currentArticles = blogContentArray[0].slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(blogContentArray[0].length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">

        <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`Blog & Guides - ${shop.name}`}
      />

      <main>
        <Header title={shop.name} name={shop.name} domain={shop.domain} logo={brand.logo} />
        
        <section className="blog" id='about'>
          
            <div className='about-banner'>
              <div className='filter'>
                <h1>Guides : Achat - Fitness - Alimentation </h1>
              </div>
            </div>
            <div className="wrapper">
            <div className="articles-list">
              {currentArticles.map(article => (
                <a href={`/blog/${article.slug}`} key={article.slug} className="article-item">
                  <img src={article.thumbnail} alt={article.title} />
                  <h3>{article.title}</h3>
                  <span className=' bg-primary'>Lire l'article</span>
                </a>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>
      <Footer shop={shop}/>
    </div>
  );
};

export async function getStaticProps() {
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  

  return {
    props: {
      data:data[0],
      shop: shop[0],
      brand: brand[0],
    },
  };
}

export default Blog;