import { useEffect } from 'react';
import Head from 'next/head';

const MolliePage = () => {
  useEffect(() => {
    const createFormElement = (id, parent) => {
      const div = document.createElement('div');
      div.setAttribute('id', id);
      parent.appendChild(div);
      return div;
    };

    const createErrorElement = (id, parent) => {
      const div = document.createElement('div');
      div.setAttribute('id', id);
      parent.appendChild(div);
      return div;
    };

    const script = document.createElement('script');
    script.src = 'https://js.mollie.com/v1/mollie.js';
    script.async = true;

    script.onload = () => {
      if (document.getElementById('mollie-form')) {
        return; // Form already exists, do not create another one
      }

      const mollie = Mollie('pfl_HaPLTnNWCo', { locale: 'fr_FR', testmode: true });

      const cardNumber = mollie.createComponent('cardNumber');
      const cardHolder = mollie.createComponent('cardHolder');
      const expiryDate = mollie.createComponent('expiryDate');
      const verificationCode = mollie.createComponent('verificationCode');

      const form = document.createElement('form');
      form.setAttribute('id', 'mollie-form');
      form.setAttribute('action', '/api/create-payment');
      form.setAttribute('method', 'POST');

      createFormElement('card-number', form);
      createErrorElement('card-number-error', form);
      createFormElement('card-holder', form);
      createErrorElement('card-holder-error', form);
      createFormElement('expiry-date', form);
      createErrorElement('expiry-date-error', form);
      createFormElement('verification-code', form);
      createErrorElement('verification-code-error', form);

      const submitButton = document.createElement('button');
      submitButton.setAttribute('type', 'submit');
      submitButton.textContent = 'Pay';
      form.appendChild(submitButton);

      document.body.appendChild(form);

      cardNumber.mount('#card-number');
      cardHolder.mount('#card-holder');
      expiryDate.mount('#expiry-date');
      verificationCode.mount('#verification-code');

      const handleError = (element, error) => {
        element.textContent = error && error.touched ? error.error : '';
      };

      cardNumber.addEventListener('change', event => handleError(document.getElementById('card-number-error'), event));
      cardHolder.addEventListener('change', event => handleError(document.getElementById('card-holder-error'), event));
      expiryDate.addEventListener('change', event => handleError(document.getElementById('expiry-date-error'), event));
      verificationCode.addEventListener('change', event => handleError(document.getElementById('verification-code-error'), event));

      form.addEventListener('submit', async e => {
        e.preventDefault();

        const { token, error } = await mollie.createToken();

        if (error) {
          // Handle error gracefully
          return;
        }

        // Add token to the form
        const tokenInput = document.createElement('input');
        tokenInput.setAttribute('type', 'hidden');
        tokenInput.setAttribute('name', 'cardToken');
        tokenInput.setAttribute('value', token);

        form.appendChild(tokenInput);

        // Submit form to the server
        form.submit();

      });
    };

    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Head>
        <title>My Checkout</title>
      </Head>
    </>
  );
};

export default MolliePage;