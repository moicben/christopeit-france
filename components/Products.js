import React, { useState, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Pagination from './Pagination'; // Import du composant Pagination

const Products = ({ title, products, description, showCategoryFilter = true, initialCategoryFilter = 'all', disablePagination = false, categories }) => {
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
    const deliveryDate = addDays(today, deliveryDays);
    return format(deliveryDate, 'EEE dd MMM', { locale: fr });
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
                <span className='best-wrap'>🏆 TOP VENTE</span>
                <img
                  src={
                    hoveredProduct === product.slug && product.images?.[1]
                      ? product.images[1]
                      : product.images?.[0]
                  }
                  alt={product.title}
                />
                <h3>{product.title}</h3>
                <p className={`stock ${product.stock.startsWith('Plus que') ? 'low' : ''}`}>
                  <span>⋅</span>{product.stock}
                </p>
                <p className='delivery'>Livraison estimée : {getDeliveryDate(product.delivery)}</p>
                <p className='price'></p>
                <p>
                  {product.discounted ? (
                    <>
                      <span className='initial-price'>{product.discounted},00 €</span>
                      <span className='new-price'>{product.price},00 €</span>
                    </>
                  ) : (
                    product.price + ",00 €"
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