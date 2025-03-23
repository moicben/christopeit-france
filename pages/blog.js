import React, { useState } from 'react';
import Link from 'next/link';
import Head from '../components/Head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Pagination from '../components/Pagination'; // Import du composant Pagination

const Blog = ({ site, articles }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div key={site.id} className="container">
      <Head title={`Blog & Guides - ${site.shopName}`} />
      <main>
        <Header shopName={site.shopName} cartCount={0} keywordPlurial={site.keywordPlurial} />
        
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
                  <span>Lire l'article</span>
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
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

export async function getStaticProps() {
  const content = await import('../content.json');
  const articlesData = await import('../articles.json');

  return {
    props: {
      site: content.sites[0],
      articles: articlesData.articles,
    },
  };
}

export default Blog;