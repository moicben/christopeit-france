import React from 'react';
import Link from 'next/link';
import Head from '../components/Head';
import Footer from '../components/Footer';
import Header from '../components/Header';

const APropos = ({ site }) => {
  return (
    <div key={site.id} className="container">
      <Head title={`Notre histoire - ${site.shopName}`} />
      <main>
        <Header shopName={site.shopName} cartCount={0} keywordPlurial={site.keywordPlurial} />
        
        <section className="a-propos" id='about'>
          {/* <div className='about-banner'>
            <div className='filter'>
              <h1>Il était une fois... Christopeit Sport</h1>
            </div>
          </div>
          <div className="wrapper">
          </div> */}
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

export default APropos;