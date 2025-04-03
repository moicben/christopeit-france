import React, { useState, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Pagination from './Pagination'; // Import du composant Pagination

const Products = ({ title, products, description, showCategoryFilter = true, initialCategoryFilter = 'all', disablePagination = false, categories, data, shop }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('az');
  const [priceRange, setPriceRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const productsPerPage = 15;
  const productListRef = useRef(null);

  // Création d'un dictionnaire pour accéder rapidement aux slugs des catégories par leur ID
  const categorySlugMap = (categories || []).reduce((map, category) => {
    map[category.id] = category.slug;
    return map;
  }, {});

  const filteredProducts = products.filter(product => {
    const price = product.price;
    const priceMatch = (priceRange === '100-200' && price >= 100 && price < 200) ||
                       (priceRange === '200-300' && price >= 200 && price < 300) ||
                       (priceRange === '300-400' && price >= 300 && price < 400) ||
                       (priceRange === '400+' && price >= 400) ||
                       (priceRange === 'all');
    const categoryMatch = categoryFilter === 'all' ||
                          (categoryFilter === 'bestsellers' && product.bestseller === true) ||
                          product.productCategorySlug === categoryFilter;
    return priceMatch && categoryMatch;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    const priceA = a.price;
    const priceB = b.price;
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (sortOrder === 'asc') {
      return priceA - priceB;
    } else if (sortOrder === 'desc') {
      return priceB - priceA;
    } else if (sortOrder === 'az') {
      return titleA.localeCompare(titleB);
    } else if (sortOrder === 'za') {
      return titleB.localeCompare(titleA);
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = disablePagination ? sortedProducts : sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: productListRef.current.offsetTop - 100,
      behavior: 'smooth'
    });
  };

  const getDeliveryDate = (deliveryType) => {
    const today = new Date();
    let deliveryDays;
    if (deliveryType === 'Express') {
      deliveryDays = 4;
    } else if (deliveryType === 'Fast') {
      deliveryDays = 5;
    } else if (deliveryType === 'Normal') {
      deliveryDays = 6;
    } else {
      return '';
    }

    const languageMap = {
      FR: fr,
      EN: undefined,
      DE: require('date-fns/locale/de'),
      ES: require('date-fns/locale/es'),
      IT: require('date-fns/locale/it'),
      PT: require('date-fns/locale/pt'),
      NL: require('date-fns/locale/nl'),
      RU: require('date-fns/locale/ru'),
      ZH: require('date-fns/locale/zh-CN'),
      JA: require('date-fns/locale/ja'),
      KO: require('date-fns/locale/ko'),
      AR: require('date-fns/locale/ar'),
      SV: require('date-fns/locale/sv'),
      NO: require('date-fns/locale/nb'),
      DA: require('date-fns/locale/da'),
      FI: require('date-fns/locale/fi'),
      PL: require('date-fns/locale/pl'),
      TR: require('date-fns/locale/tr'),
      CS: require('date-fns/locale/cs'),
      HU: require('date-fns/locale/hu'),
      RO: require('date-fns/locale/ro')
    };

    const language = languageMap[shop.language] || undefined; // Utilisation de la locale correspondante ou undefined par défaut
    const deliveryDate = addDays(today, deliveryDays);
    return format(deliveryDate, 'EEE dd MMM', { locale:language });
  };

  return (
    <section className="products">
      <div className='wrapper'>
        {title && <h2>{title}</h2>}
        <div className='product-filters'>
          {/* ...existing filters... */}
        </div>
        <div className="product-list" ref={productListRef}>
          {currentProducts.map(product => {
            const categorySlug = categorySlugMap[product.category_id]; // Récupération du slug de la catégorie via category_id
            if (!categorySlug) {
              console.warn(`Aucun slug trouvé pour la catégorie avec ID ${product.category_id}`);
              return null; // Ignorer les produits sans catégorie correspondante
            }
            return (
              <a
              href={`/${categorySlug}/${product.slug}`}
              key={product.id}
              className={`product-item ${product.bestseller ? 'best-seller' : ''}`}
              onMouseEnter={() => setHoveredProduct(product.slug)}
              onMouseLeave={() => setHoveredProduct(null)}
              >
              <span className='best-wrap bg-main color-primary'>🏆 {data.productBestsellerLabel}</span>
              <img
                src={
                hoveredProduct === product.slug && product.images?.[1]
                  ? product.images[1]
                  : product.images?.[0]
                }
                alt={product.title}
              />
              <h3>{product.title}</h3>
              <p className={`stock ${product.stock.startsWith(data.productStockLowLabel) ? 'low' : ''}`}>
                <span>⋅</span>{product.stock}
              </p>
              <p className='delivery'>{data.productDeliveryLabel} {getDeliveryDate(product.delivery)}</p>
              <p className='price'></p>
              <p>
                {product.discounted ? (
                <>
                  <span className='initial-price'>{product.discounted.toLocaleString(shop.language, { minimumFractionDigits: 2 })}{shop.currency}</span>
                  <span className='new-price color-primary'>{product.price.toLocaleString(shop.language, { minimumFractionDigits: 2 })}{shop.currency}</span>
                </>
                ) : (
                `${product.price.toLocaleString(shop.language, { minimumFractionDigits: 2 })}${shop.currency}`
                )}
              </p>
              </a>
            );
          })}
        </div>
        {!disablePagination && filteredProducts.length > productsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default Products;