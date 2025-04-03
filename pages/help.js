import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from '../components/Head';
import Testimonials from '../components/Testimonials';

import {fetchData} from '../lib/supabase'; // Assurez-vous que le chemin est correct

const Faq = ({ data, brand, shop, categories }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div  className="container">

        <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.faqPageLabel} - ${shop.name}`}
        />
            
            
            
            <main>
                <Header logo={brand.logo} categories={categories} data={data} shop={shop} />
                <div className="faq-container">
                    <h1>{data.faqPageTitle}</h1>
                    {data.faqContent.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                {faq.question}
                            </div>
                            <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`} dangerouslySetInnerHTML={{ __html: faq.answer }}>
                            </div>
                        </div>
                    ))}
                </div>
                <Testimonials data={data} shop={shop} />
            </main>
            
            <Footer shop={shop} data={data} />
        </div>
    );
};

export async function getStaticProps() {
    const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
    const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
    const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
    const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });

    return {
        props: {
            data: data[0],
            shop: shop[0],
            brand: brand[0],
            categories: categories,
        },
    };
}

export default Faq;