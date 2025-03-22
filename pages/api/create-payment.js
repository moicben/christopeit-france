import { createMollieClient } from '@mollie/api-client';
import { createClient } from '@supabase/supabase-js';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_LIVE_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { cardToken, amount, orderNumber, email, name, phone, address, cart } = req.body;

    try {
      console.log('Received request:', { cardToken, amount, orderNumber, email, name, phone, address, cart }); // Debugging input

      // Créer le paiement avec Mollie
      const payment = await mollieClient.payments.create({
        method: 'creditcard',
        amount: {
          currency: 'EUR',
          value: parseFloat(amount).toFixed(2)
        },
        description: `Commande #${orderNumber}`,
        redirectUrl: `https://www.christopeit-france.shop/verification?orderNumber=${orderNumber}`, // Static redirect URL
        webhookUrl: `https://www.christopeit-france.shop/api/webhook?orderNumber=${orderNumber}`, // Webhook pour les notifications Mollie
        cardToken: cardToken,
      });

      console.log('Payment created successfully:', payment); // Debugging Mollie response

      // Transform cart to only include product IDs and quantities
      const simplifiedCart = cart.map(item => ({
        product: item.productTitle, 
        quantity: item.quantity,  
      }));

      // Insérer une ligne dans la table orders de Supabase
      const { data, error } = await supabase.from('orders').insert([{
        id: orderNumber,
        paymentId: payment.id,
        status: 'pending', 
        amount: parseFloat(amount).toFixed(2),
        email, 
        name, 
        phone, 
        address, 
        cart: JSON.stringify(simplifiedCart), 
        created_at: new Date().toISOString(),
      }]);

      if (error) {
        console.error('Error inserting into Supabase:', error);
        throw new Error('Failed to create order in database');
      }

      console.log('Order created in Supabase:', data);

      // Retourne l'ID du paiement et l'URL de paiement
      res.status(200).json({
        paymentId: payment.id,
        paymentUrl: payment._links.checkout.href,
      });
    } catch (error) {
      console.error('Error creating payment:', error?.response || error.message || error); // Safely log the error
      res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};