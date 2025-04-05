import React, { useState } from 'react';
import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from '../lib/supabase';

const TrackOrder = ({ shop, brand, data, categories, reviews }) => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [error, setError] = useState('');

    const handleTrackOrder = async () => {
        try {
            const response = await fetch(`/api/track?number=${trackingNumber}`);
            const data = await response.json();
            if (data && data.status) {
                setTrackingInfo(data);
                setError('');
            } else {
                setTrackingInfo(null);
                setError('Code de suivi non-trouvé');
            }
        } catch (err) {
            setTrackingInfo(null);
            setError('Erreur : code de suivi non-trouvé dans la base de données'); 
        }
    };

    return (
        <div className="container">
            <Head name={shop.name} domain={shop.domain}
                favicon={brand.favicon} graph={brand.graph}
                colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
                title={`${data.followPageLabel} - ${shop.name}`}
            />
            
            <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
            
            <main>
                <div className="track-order-container">
                    <h1>{data.followPageLabel}</h1>
                    <p>{data.followPageDesc}</p>
                    <div className="track-order-form">
                        <input
                            type="text"
                            placeholder={data.followPageInput}
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                        <button onClick={handleTrackOrder}>{data.followPageCta}</button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {trackingInfo && (
                        <div className="tracking-info">
                            <h2>Informations de suivi</h2>
                            <p>Status: {trackingInfo.status}</p>
                            <p>Dernière mise à jour: {trackingInfo.lastUpdate}</p>
                            <p>Lieu actuel: {trackingInfo.currentLocation}</p>
                        </div>
                    )}
                </div>
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
    const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });

    return {
        props: {
            shop: shop[0],
            data: data[0],
            brand: brand[0],
            categories: categories,
            reviews: reviews,   
        },
    };
}
export default TrackOrder;
