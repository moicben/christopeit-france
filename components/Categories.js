import React from 'react';

const Categories = ({ categories, title }) => {
  // Filter out "tous-les-equipements"

  const filteredCategories = categories.filter(category => category.slug !== "tous-les-equipements");

  return (
    <section className="categories">
      <div className='wrapper'>
        {title && <h2>{title}</h2>}
        <div className='category-grid'>
          {filteredCategories.map((category, index) => (
            <a href={`/${category.slug}`} key={index} className="category-card" style={{ backgroundImage: `url(${category.image})` }}>
              <div className="category-content">
                <h3>{category.title}</h3>
                <p className="category-button">Découvrir</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;