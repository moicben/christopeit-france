import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import axios from 'axios';

import Head from '/components/Head';
import CheckoutSummary from '/components/CheckoutSummary';
import CheckoutForm from '/components/CheckoutForm';
// import CheckoutVerify from '/components/CheckoutVerify';

import { fetchData } from '../lib/supabase';


const Checkout = ({data, shop, brand}) => {
  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showVerificationWrapper, setShowVerificationWrapper] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankLogo, setBankLogo] = useState('');
  const [cardType, setCardType] = useState('');
  const [cardScheme, setCardScheme] = useState('');
  const [cardCountry, setCardCountry] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Générer un numéro de commande aléatoire
  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const groupedCart = storedCart.reduce((acc, item) => {
      const existingItem = acc.find(i => i.title === item.title);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: item.quantity });
      }
      return acc;
    }, []);
    setCart(groupedCart);
  }, []);

  useEffect(() => {
    emailjs.init("8SL7vzVHt7qSqEd4i");
  }, []);

  const totalPrice = cart.reduce((total, item) => {
    const price = item.price;
    return total + (price * item.quantity);
  }, 0).toFixed(2);

  const discount = (totalPrice * 0.15).toFixed(2);
  const discountedPrice = (totalPrice - discount).toFixed(2);

  const paymentFees = selectedPaymentMethod === 'card' ? (discountedPrice * 0.025).toFixed(2) : 0;

  const showStep = (step) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0)); // Revenir à l'étape précédente
  };

  const handleRetry = () => {
    setShowVerificationWrapper(false);
    setCurrentStep(1);
  };

  const openPopup = (url) => {
    setIframeUrl(url);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setIframeUrl('');
  };

  //console.log('CART', cart);

  return (
    <div className="paiement-container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.checkoutPageLabel} - ${shop.name}`}
      />

      <div className="left-column bg-main">
        <a className="back" href="/"><img src={brand.logo}/></a>
        <CheckoutSummary 
          cart={cart}
          totalPrice={totalPrice}
          discount={discount}
          discountedPrice={discountedPrice}
          name={shop.name}
          paymentFees={paymentFees}
          data={data}
          shop={shop}
        />
      </div>
      <div className="right-column">
        <CheckoutForm
          currentStep={currentStep}
          showStep={showStep}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          // proceedCheckout={proceedCheckout}
          discountedPrice={discountedPrice}
          cart={cart}
          shop={shop}
          orderNumber={orderNumber}
          onBack={handleBack} // Transmettre la fonction handleBack
          data={data}
        />
        <div className='legals-link'>
          <a onClick={() => openPopup('/mentions-legales')}>{data.legalsPageLabel}</a>
          <a onClick={() => openPopup('/conditions-generales')}>{data.cgvPageLabel}</a>
          <a onClick={() => openPopup('/politique-de-confidentialite')}>{data.confidentialityPageLabel}</a>
          <br />
          <a onClick={() => openPopup('/politique-des-retours')}>{data.returnsPageLabel}</a>
          <a onClick={() => openPopup('/follow-order')}>{data.followPageLabel}</a>
        </div>

        {showPopup && (
          <div className="popup-overlay" onClick={closePopup}>
            <button className="close-popup" onClick={closePopup}>X</button>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <iframe src={iframeUrl} className="popup-iframe" title="Legal Content"></iframe>
            </div>
          </div>
        )}
      </div>

      {/* {showVerificationWrapper && (
        <CheckoutVerify
          verificationError={verificationError}
          bankName={bankName}
          bankLogo={bankLogo} // Passer bankLogo en tant que prop
          cardType={cardType}
          cardScheme={cardScheme}
          cardCountry={cardCountry}
          discountedPrice={discountedPrice}
          onRetry={handleRetry} // Passer la fonction handleRetry
        />
      )} */}
    </div>
  );
}

export async function getStaticProps() {

  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      data: data[0],
      shop: shop[0],
      brand: brand[0],
    },
  };
}

export default Checkout;