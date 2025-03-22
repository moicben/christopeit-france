import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Faq = ({ site }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

   const faqs = [
    {
        question: '📦 Quelle est votre politique de retour ?',
        answer: 'Vous disposez de 60 jours après réception pour retourner un article.<br/><br/>' +
                '- L’article doit être neuf, non utilisé et dans son emballage d’origine.<br/>' +
                '- Contactez-nous pour obtenir une étiquette de retour et les instructions nécessaires.<br/>' +
                '- Une fois le colis reçu et vérifié, le remboursement intégral sera effectué sous 2 à 5 jours ouvrés.'
    },
    {
        question: '🚚 Comment puis-je suivre ma commande ?',
        answer: 'Dès l’expédition, vous recevrez un email de confirmation contenant un numéro de suivi.<br/><br/>' +
                'Vous pouvez également suivre votre commande en temps réel via votre espace client.'
    },
    {
        question: '🌍 Offrez-vous la livraison internationale ?',
        answer: 'Oui, nous livrons dans plusieurs pays européens et à l’international.<br/><br/>' +
                'Les frais et délais varient selon la destination. Les options de livraison disponibles s’afficheront lors de votre commande.'
    },
    {
        question: '📞 Comment puis-je contacter le service client ?',
        answer: 'Notre service client est disponible 7j/7 pour répondre à vos questions.<br/><br/>' +
                '📧 Email : support@christopeit-france.shop<br/>' +
                '📩 Formulaire de contact : Disponible sur notre site'
    },
    {
        question: '💳 Quels modes de paiement acceptez-vous ?',
        answer: 'Nous acceptons plusieurs méthodes de paiement sécurisées :<br/><br/>' +
                '- Cartes bancaires : Visa, Mastercard, American Express<br/>' +
                '- PayPal<br/>' +
                '- Virement bancaire'
    },
    {
        question: '🛍 Puis-je modifier ma commande après l\'avoir passée ?',
        answer: 'Oui, tant que votre commande n’a pas encore été expédiée.<br/><br/>' +
                'Contactez-nous au plus vite pour toute modification.<br/>' +
                'Une fois expédiée, il ne sera plus possible de la modifier, mais vous pourrez exercer votre droit de retour sous 60 jours.'
    },
    {
        question: '🔖 Proposez-vous des réductions pour les commandes en gros ?',
        answer: 'Oui, nous offrons des tarifs préférentiels pour les commandes en grande quantité.<br/><br/>' +
                'Contactez-nous via notre formulaire de contact pour obtenir un devis personnalisé.'
    },
    {
        question: '📩 Comment puis-je m\'inscrire à votre newsletter ?',
        answer: 'Inscrivez-vous en entrant votre adresse email en bas de notre site.<br/><br/>' +
                'Vous recevrez en avant-première nos promotions, conseils fitness et nouveautés.'
    },
    {
        question: '⏳ Quels sont vos délais de livraison ?',
        answer: 'Nos délais de livraison varient selon votre localisation :<br/><br/>' +
                '- France Métropolitaine : 3 à 5 jours ouvrés<br/>' +
                '- Belgique, Luxembourg, Suisse : 2 à 5 jours ouvrés<br/>' +
                '- Autres destinations internationales** : 7 à 14 jours ouvrés'
    },
    {
        question: '❌ Puis-je annuler ma commande ?',
        answer: 'Oui, tant qu’elle **n’a pas encore été expédiée**.<br/><br/>' +
                'Une fois l’expédition réalisée, vous pourrez effectuer un **retour sous 60 jours** après réception.'
    },
    {
        question: '🎟 Comment puis-je utiliser un code promo ?',
        answer: 'Lors du passage en caisse, entrez votre **code promo** dans le champ prévu à cet effet.<br/><br/>' +
                'Cliquez sur **Appliquer** et la réduction sera automatiquement ajoutée à votre total.'
    },
    {
        question: '⭐ Avez-vous un programme de fidélité ?',
        answer: 'Oui ! Notre programme de fidélité vous permet **d’accumuler des points à chaque achat**.<br/><br/>' +
                'Ces points sont convertibles en **réductions** pour vos prochains achats.<br/>' +
                'L’inscription est **gratuite et automatique** dès votre première commande.'
    }
];


    return (
        <div key={site.id} className="container">
            
            <Header shopName={site.shopName} keywordPlurial={site.keywordPlurial} />
            
            <main>
                <div className="faq-container">
                    <h1>Questions fréquentes</h1>
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                {faq.question}
                            </div>
                            <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`} dangerouslySetInnerHTML={{ __html: faq.answer }}>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            
            <Footer shopName={site.shopName} footerText={site.footerText} />
        </div>
    );
};

export async function getStaticProps() {
    const content = await import('../content.json');
    if (!content.sites || content.sites.length === 0) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            site: content.sites[0],
        },
    };
}

export default Faq;