import React, { useRef, useEffect, useState } from 'react';
import CheckoutVerify from './cardToTransfer';
import MollieForm from './MollieForm';
import Cookies from 'js-cookie'; // Importer la bibliothèque js-cookie
import CustomPay from './CustomPay';
import { useRouter } from 'next/router'; // Importer useRouter

const CheckoutForm = ({ currentStep, showStep, selectedPaymentMethod, setSelectedPaymentMethod, discountedPrice, cart, name, showVerificationWrapper, setShowVerificationWrapper, onBack, data, shop,totalPrice }) => {
  const router = useRouter(); // Utiliser useRouter
  const expiryDateRef = useRef(null);
  const cardNumberRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [paymentError, setPaymentError] = useState(false);

  const [isLoading, setIsLoading] = useState(false); 
  const [show3DSecurePopup, setShow3DSecurePopup] = useState(false);

  // Charger les données du formulaire et l'orderNumber depuis les cookies
  const [formData, setFormData] = useState(() => {
    const savedData = Cookies.get('checkoutFormData');
    const savedOrderNumber = Cookies.get('orderNumber');

    return {
      ...JSON.parse(savedData || '{}'),
      orderNumber: savedOrderNumber || Math.floor(100000 + Math.random() * 900000).toString(),
    };
  });

  // Sauvegarder les données du formulaire et l'orderNumber dans les cookies
  useEffect(() => {
    Cookies.set('checkoutFormData', JSON.stringify(formData), { expires: 1 }); // Expire dans 1 jour
    Cookies.set('orderNumber', formData.orderNumber, { expires: 1 }); // Expire dans 1 jour
  }, [formData]);

  useEffect(() => {
    if (router.query.failed === 'true') {
      setGlobalError(data.checkoutFormPaymentError);
      setPaymentError(true);
      setIsLoading(false); 
      setShow3DSecurePopup(false);
    }
  }, [router.query]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGlobalError('');
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value) {
        delete newErrors[name];
      } else {
        newErrors[name] = `${name} ${data.checkoutFormIsRequired}`;
      }
      return newErrors;
    });
  };

  const validateStep = (step) => {
    const errors = {};
    const requiredFields = ['address', 'postal', 'city', 'email', 'name', 'phone'];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (!value) {
        errors[field] = `${field} ${data.checkoutFormIsRequired}`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = async (step) => {
    if (step === 1 && !validateStep(step)) {
      setGlobalError(data.checkoutFormInfoRequired);
      return;
    }

    setIsLoading(true); // Activer le chargement
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: discountedPrice,
          cart,
        }),
      });

      if (!response.ok) {
        throw new Error(data.checkoutFormPaymentError);
      }
    } catch (error) {
      console.error(data.checkoutFormPaymentError, error);
      setGlobalError(data.checkoutFormPaymentError);
      setIsLoading(false); // Désactiver le chargement en cas d'erreur
      return;
    }
    setIsLoading(false); // Désactiver le chargement après succès

    setGlobalError('');
    showStep(step);
  };



  const handleRetry = () => {
    setShowVerificationWrapper(false);
    showStep(1); // Retour à l'étape du choix de modes de paiement
  };

  return (
    <div className="checkout-form">
      {paymentError &&
      <div className="error-banner">
        <a href='/contact' target='_blank'>{data.checkoutFormContactSupport}</a>.
      </div>
      }

      <input type="hidden" name="totalPrice" value={discountedPrice} />
      <input type="hidden" name="products" value={cart.map((item) => `${item.productTitle} (x${item.quantity})`).join(', ')} />
      <input type="hidden" name="website" value={name} />

      <div className={`checkout-step ${currentStep === 0 ? 'active' : ''}`}>
        <h3>{data.checkoutFormDeliveryInfo}</h3>
        <input
          type="text"
          name="address"
          placeholder={data.checkoutFormAddressPlaceholder}
          value={formData.address}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="suite"
          placeholder={data.checkoutFormSuitePlaceholder}
          value={formData.suite}
          onChange={handleInputChange}
        />
        <div className="form-row">
          <input
            type="text"
            name="postal"
            placeholder={data.checkoutFormPostalPlaceholder}
            value={formData.postal}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder={data.checkoutFormCityPlaceholder}
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <h3>{data.checkoutFormCustomerAccount}</h3>
        <input
          type="text"
          name="email"
          placeholder={data.checkoutFormEmailPlaceholder}
          value={formData.email}
          onChange={handleInputChange}
        />
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder={data.checkoutFormNamePlaceholder}
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder={data.checkoutFormPhonePlaceholder}
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" id="delivery-checkout" onClick={() => handleNextStep(1)} disabled={isLoading}>
          {isLoading ? <span className="loader border-top-primary"></span> : data.checkoutFormProceedToPayment}
        </button>
        {globalError && <p className="error">{globalError}</p>}
      </div>

      <div className={`checkout-step ${currentStep === 1 ? 'active' : ''}`}>
        <h3 className="method">{data.checkoutFormPaymentMethod}</h3>

        <label className={`payment-method  payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={selectedPaymentMethod === 'card'}
            onChange={() => setSelectedPaymentMethod('card')}
          />
          <img className="card" src="/card-badges.png" alt={data.checkoutFormCardAlt} />
          <span className='info'>{data.checkoutFormCardInfo}</span>
          <span className='fees'>{data.checkoutFormCardFees}</span>
        </label>

        <label className={`payment-method ${selectedPaymentMethod === 'bankTransfer' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="bankTransfer"
            checked={selectedPaymentMethod === 'bankTransfer'}
            onChange={() => setSelectedPaymentMethod('bankTransfer')}
          />
          <img src={shop.language !== "FR" ? "bank-transfer.png" : "/virement.png"} className={shop.language !== "FR" ? "transfer en" : "transfer"} alt={data.checkoutFormBankTransferAlt} />
          <span className='info'>{data.checkoutFormBankTransferInfo}</span>
        </label>
        
        
        <label className={`unvalaible payment-method ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={selectedPaymentMethod === 'paypal'}
            onChange={() => setSelectedPaymentMethod('paypal')}
          />
          <img src="/paypal-simple.png" alt={data.checkoutFormPaypalAlt} />
          <span className='info'>Non-éligible aux promotions</span>
        </label>
        <article className="checkout-buttons">
          <button className="back-checkout" type="button" onClick={() => showStep(0)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button type="button" id="payment-checkout" onClick={() => handleNextStep(2)}>
            {data.checkoutFormConfirm}
          </button>
        </article>
        {globalError && <p className="error">{globalError}</p>}
      </div>

      <div className={`checkout-step ${currentStep === 2 ? 'active' : ''}`}>
        {selectedPaymentMethod === 'card' && (
          <>
            <h3>{data.checkoutFormPayByCard}</h3>
            <p className="paiement">{data.checkoutFormEnterPaymentInfo}</p>
            <CustomPay
              amount={discountedPrice}
              orderNumber={formData.orderNumber}
              onBack={onBack}
              formData={formData}
              cart={cart}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              show3DSecurePopup={show3DSecurePopup}
              setShow3DSecurePopup={setShow3DSecurePopup}
              data={data}
              shop={shop}
            />
            <a target='_blank' href='https://www.westernunion.com/blog/fr/pourquoi-faire-confiance-a-western-union' className='safe-payment'>
              <i className="fas fa-lock"></i>{data.checkoutFormSecurePayment} <img src='/westernunion.png' alt="WesternUnion Payments" />
            </a>
          </>
        )}

        {selectedPaymentMethod === 'bankTransfer' && (
          <>
            <h3>{data.checkoutFormPayByBankTransfer}</h3>
            <p>{data.checkoutFormBankTransferInstructions}</p>
            <div className="iban-group">
              <p><strong>{data.checkoutFormAccountHolder} :</strong> {shop.name}</p>
              <p><strong>{data.checkoutFormIBAN} :</strong> DE47 5033 0200 4677 8799 93</p>
              <p><strong>{data.checkoutFormBIC} :</strong> MHBFDEFFXXX</p>
              <p><strong>{data.checkoutFormOrderReference} :</strong> {formData.orderNumber}</p>
              <p className='amount'><strong>{data.checkoutFormAmount} :</strong> {discountedPrice}{shop.currency}</p>
            </div>
            <p className='smaller'>{data.checkoutFormBankTransferConfirmation}</p>
            <article className='checkout-buttons'>
              <button className="back-checkout" type="button" onClick={() => showStep(1)}><i className="fas fa-arrow-left"></i></button>
              <button onClick={() => window.location.href = '/confirmation'}>{data.checkoutFormTrackOrder}</button>
            </article>
          </>
        )}

        {globalError && <p className="error">{globalError}</p>}
      </div>

      {showVerificationWrapper && (
        <CheckoutVerify
          verificationError={false}
          bankName={data.checkoutFormBankName}
          bankLogo=""
          cardType="Visa"
          cardScheme="Credit"
          cardCountry="France"
          discountedPrice={discountedPrice}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default CheckoutForm;