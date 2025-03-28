import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import content from '../content.json';
import axios from 'axios';
import CheckoutSummary from '/components/CheckoutSummary';
import CheckoutForm from '/components/CheckoutForm';
// import CheckoutVerify from '/components/CheckoutVerify';

const site = content.sites[0];

export default function Checkout() {
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
      const existingItem = acc.find(i => i.productTitle === item.productTitle);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
    setCart(groupedCart);
  }, []);

  useEffect(() => {
    emailjs.init("8SL7vzVHt7qSqEd4i");
  }, []);

  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(item.productPrice.replace('€', '').replace(',', '.')) || 0;
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


  return (
    <div className="paiement-container">
      <div className="left-column">
        <a className="back" href="/"><img src='/logo.png'/></a>
        <CheckoutSummary cart={cart} totalPrice={totalPrice} discount={discount} discountedPrice={discountedPrice} site={site} paymentFees={paymentFees} />
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
          site={site}
          orderNumber={orderNumber}
          onBack={handleBack} // Transmettre la fonction handleBack
        />
        <div className='legals-link'>
          <a onClick={() => openPopup('/mentions-legales')}>Mentions légales</a>
          <a onClick={() => openPopup('/conditions-generales')}>Conditions générales</a>
          <a onClick={() => openPopup('/politique-de-confidentialite')}>Politique de confidentialité</a>
          <br />
          <a onClick={() => openPopup('/politique-des-retours')}>Politique des retours</a>
          <a onClick={() => openPopup('/suivre-mon-colis')}>Suivre mon colis</a>
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