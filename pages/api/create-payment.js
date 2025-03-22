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

      // Mettre à jour le statut de la commande dans Supabase
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'pending', paymentId: payment.id })
        .eq('id', orderNumber);

      if (updateError) {
        console.error('Error updating order status in Supabase:', updateError);
        throw new Error('Failed to update order status in database');
      }

      console.log('Order status updated to pending in Supabase');

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