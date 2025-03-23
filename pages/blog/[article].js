import React from 'react';
import { useRouter } from 'next/router';
import Head from '../../components/Head';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const Article = ({ site, article }) => {
  const router = useRouter();
  const { article: articleId } = router.query;

  if (!article) {
    return <p>Article non trouvé</p>;
  }

  return (
    <div key={site.id} className="container">
      <Head title={`${site.shopName} - ${article.title}`} />
      <main>
        <Header shopName={site.shopName} cartCount={0} keywordPlurial={site.keywordPlurial} />
        
        <section className="article" id='article'>
          <div className='wrapper'>
            <div className="article-content">
              <img src={article.thumbnail} alt={article.title} />
              <h1>{article.title}</h1>
              <h3 className='desc'>{article.excerpt}</h3>
              <div className="content" dangerouslySetInnerHTML={{ __html: article.content }}/>
            </div>
          </div>
        </section>
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

export async function getStaticPaths() {
  const articlesData = await import('../../articles.json');
  const paths = articlesData.articles.map(article => ({
    params: { article: article.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const content = await import('../../content.json');
  const articlesData = await import('../../articles.json');
  const article = articlesData.articles.find(article => article.slug === params.article);

  return {
    props: {
      site: content.sites[0],
      article,
    },
  };
}

export default Article;