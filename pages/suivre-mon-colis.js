import React, { useState } from 'react';
import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from '../lib/supabase';

const TrackOrder = ({ shop,brand,data }) => {
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
            <Head>
                <title>{`Suivre mon colis - ${shop.name}`}</title>
                <meta name="description" content="Suivez votre commande en temps réel" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <Header title={shop.name} name={shop.name} domain={shop.domain} logo={brand.logo} />
            
            <main>
                <div className="track-order-container">
                    <h1>Suivre mon colis</h1>
                    <p>Entrez votre numéro de suivi ci-dessous pour obtenir les informations les plus récentes sur votre commande. Nous nous engageons à vous fournir des mises à jour en temps réel pour que vous puissiez suivre votre colis en toute tranquillité.</p>
                    <div className="track-order-form">
                        <input
                            type="text"
                            placeholder="Entrez votre numéro de suivi"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                        <button onClick={handleTrackOrder}>Suivre</button>
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
            
            <Footer shop={shop} />
        </div>
    );
};

export async function getStaticProps() {
    const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
    const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
    const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });


    return {
        props: {
            site: data[0],
            shop: shop[0],
            brand: brand[0],
        },
    };
}
export default TrackOrder;
