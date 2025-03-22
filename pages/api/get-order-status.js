import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, res) => {
  if (req.method === 'GET') {
    const { orderNumber } = req.query;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderNumber)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du statut:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération du statut' });
      }

      res.status(200).json({ status: data.status });
    } catch (error) {
      console.error('Erreur serveur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};