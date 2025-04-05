import React, { useState } from 'react';

import Head from '../components/Head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Pagination from '../components/Pagination'; // Import du composant Pagination
import Testimonials from '../components/Testimonials';

import { fetchData } from 'lib/supabase';

const Blog = ({ shop, data, brand, categories, reviews, posts }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // Ensure posts is an array
  const blogContentArray = Array.isArray(posts) ? posts : Object.values(posts);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

  // Slice the blogContentArray directly
  const currentArticles = blogContentArray.slice(indexOfFirstArticle, indexOfLastArticle);

  // Calculate total pages based on the length of blogContentArray
  const totalPages = Math.ceil(blogContentArray.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Console log for debugging
  console.log('Current Articles:', currentArticles);
  console.log('Total Pages:', totalPages);
  console.log('Current Page:', currentPage);
  console.log('Blog Content Array:', blogContentArray);

  return (
    <div className="container">

        <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.blogPageLabel} - ${shop.name}`}
      />

      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        
        <section className="blog" id='about'>
          
            <div className='about-banner'>
              <div className='filter'>
                <h1>{data.blogPageTitle}</h1>
              </div>
            </div>
            <div className="wrapper">
            <div className="articles-list">
              {currentArticles.map(article => (
                <a href={`/blog/${article.slug}`} key={article.slug} className="article-item">
                  <img src={article.thumbnail} alt={article.title} />
                  <h3>{article.title}</h3>
                  <span className=' bg-primary'>{data.blogArticleCta}</span>
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
        <Testimonials data={data} shop={shop} reviews={reviews} />
      </main>
      <Footer shop={shop} data={data} />
    </div>
  );
};

export async function getStaticProps() {
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });
  const posts = await fetchData('posts', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      data:data[0],
      shop: shop[0],
      brand: brand[0],
      categories: categories,
      reviews: reviews,
      posts: posts,
    },
  };
}

export default Blog;