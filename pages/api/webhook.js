import { createMollieClient } from '@mollie/api-client';
import { createClient } from '@supabase/supabase-js';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_LIVE_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { orderNumber } = req.query; // Numéro de commande par le site
    const { id } = req.body; // ID du paiement envoyé par Mollie

    try {
      const payment = await mollieClient.payments.get(id);

      let status = 'pending';
      if (payment.status === 'paid') {
        status = 'paid';
        console.log(`Paiement ${id} capturé avec succès.`);
      } else if (payment.status === 'failed') {
        status = 'failed';
        console.log(`Paiement ${id} a échoué.`);
      } else {
        console.log(`Paiement ${id} en attente ou annulé. Statut: ${payment.status}`);
        status = payment.status;
      }

      // Mettre à jour le statut dans la table orders de Supabase
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderNumber);

      if (error) {
        console.error('Error updating Supabase:', error);
        throw new Error('Failed to update order status in database');
      }

      console.log('Order status updated in Supabase:', data);

      // Réponse JSON avec le statut actuel
      res.status(200).json({ status, orderNumber });
    } catch (error) {
      console.error('Erreur Webhook:', error.message);
      res.status(500).json({ error: 'Erreur lors de la récupération du paiement.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};