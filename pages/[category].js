import { useRouter } from "next/router";
import productsData from "../products.json";
import categoriesData from "../categories.json";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Head from 'next/head';
import Categories from '../components/Categories';
import ScrollingBanner from "components/ScrollingBanner";

const CategoryPage = ({ category, filteredProducts, site, otherCategories }) => {
  if (!category) {
    return <h1>Erreur 404 - Catégorie non trouvée</h1>;
  }

  const getRandomIcon = () => {
    const icons = [
      "fas fa-check",
      "fas fa-star",
      "fas fa-heart",
      "fas fa-cog",
      "fas fa-bolt",
      "fas fa-leaf",
      "fas fa-gem",
      "fas fa-lightbulb",
      "fas fa-trophy",
      "fas fa-rocket",
      "fas fa-cloud",
      "fas fa-compass",
      "fas fa-anchor",
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <div key={site.id} className="container">
      <Head>
        <title>{`${category.seoTitle} - ${site.shopName}`}</title>
      </Head>

      <main>
        <Header shopName={site.shopName} cartCount={0} keywordPlurial={site.keywordPlurial} />
        <section className="category-banner">
          <div className="wrapper" style={{ backgroundImage: `url(/${category.slug}.jpg)` }}>
            <div className="content">
              <h1>{category.name}</h1>
              <p>{category.seoDescription}</p>
            </div>
          </div>
        </section>
        <ScrollingBanner items={['Frais de ports offerts', 'Leader Allemand du fitness à domicile', 'Équipements de dernière génération', '60 jours satisfait ou remboursé', 'Frais de ports offerts', 'Boutique officielle depuis 2019', 'Support client disponible 7j/7', 'Livraison sous 2 à 5 jours ouvrés', "Guide et conseils d'installation", "+1000 avis clients positifs"]} />
       
        <Products
          products={filteredProducts}
          description={category.seoDescription}
          showCategoryFilter={false}
          disablePagination={true}
        />

        <section className="guide">
          <div className="wrapper">
            <h2>{category.guide.title}</h2>
            <div className="content">
              <ul>
                {category.guide.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <img src={`/guide-${category.slug}.jpg`} alt={category.guide.title} />
            </div>
          </div>
        </section>

        <section className="why">
          <div className="wrapper">
            <h2>{category.why.title}</h2>
            <div className="content">
              <ul>
                {category.why.points.map((point, index) => (
                  <li key={index}><i className={getRandomIcon()}></i>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="maintenance">
          <div className="wrapper">
            <h2>{category.maintenance.title}</h2>
            <div className="content">
              <ul>
                {category.maintenance.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <img src={`/maintenance-${category.slug}.jpg`} alt={category.maintenance.title} />
            </div>
          </div>
        </section>
        
        <Testimonials site={site} />
        <Categories categories={otherCategories} title='catégories similaires'/>
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

// 🔹 Génération des pages dynamiques
export async function getStaticPaths() {
  const paths = categoriesData.categories.map((category) => ({
    params: { category: category.slug },
  }));

  return { paths, fallback: false };
}

// 🔹 Préchargement des données côté serveur
export async function getStaticProps({ params }) {
  const category = categoriesData.categories.find((cat) => cat.slug === params.category);

  // Si la catégorie est "tous-les-equipements" ou "bestsellers", on filtre
  const filteredProducts = params.category === "tous-les-equipements"
    ? productsData.products
    : params.category === "bestsellers"
    ? productsData.products.filter(
        (product) => product.productBestseller === true
      )
    : productsData.products.filter(
        (product) => product.productCategorySlug === params.category
      );

  if (!category) {
    return { notFound: true };
  }

  const otherCategories = categoriesData.categories.filter((cat) => cat.slug !== params.category); // Exclure la catégorie actuelle
  const content = await import('../content.json');

  return {
    props: { category, filteredProducts, site: content.sites[0], otherCategories },
  };
}

export default CategoryPage;