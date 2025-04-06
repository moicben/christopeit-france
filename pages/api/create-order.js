import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { orderNumber, status, amount, email, name, phone, address, postal, city, cart } = req.body;

    try {
      // Vérifier si la commande existe déjà
      const { data: existingOrder, error: fetchError } = await supabase
        .from('orders')
        .select('id')
        .eq('id', orderNumber)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Ignorer l'erreur si aucune commande n'est trouvée
        console.error('Error fetching order from Supabase:', fetchError);
        throw new Error('Failed to fetch order from database');
      }

      // Transform cart to only include product IDs and quantities
      const simplifiedCart = cart.map(item => ({
        product: item.productTitle, 
        quantity: item.quantity,  
      }));

      const getUserLocation = async () => {
          try {
            const responseIp = await fetch('https://api.ipify.org?format=json');
            const dataIp = await responseIp.json();
            const ip = dataIp.ip;
      
            // const responseLocation = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_8RkVQJkGontjhO0cL3O0AZXCX17Y2&ipAddress=${dataIp.ip}`);
            // const dataLocation = await responseLocation.json();
            
            return ip;
      
          } catch (error) {
            console.error('Error fetching IP:', error);
            return null;
          }
        };

      const userLocation = await getUserLocation();

        //console.log(`User Location: ${userLocation.location}`);
        // console.log(`User Country: ${userLocation.location.country}`);
        // console.log(`User Region: ${userLocation.location.region}`);
        // console.log(`User City: ${userLocation.location.city}`);
        // console.log(`User Latitude: ${userLocation.location.lat}`);
        // console.log(`User Longitude: ${userLocation.location.lng}`);
        // console.log(`User IP: ${userLocation.ip}`);

     

      if (existingOrder) {
        // Mettre à jour la commande existante
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: "updated",
            amount,
            cart: JSON.stringify(simplifiedCart),
          })
          .eq('id', orderNumber);

        if (updateError) {
          console.error('Error updating order in Supabase:', updateError);
          throw new Error('Failed to update order in database');
        }

        res.status(200).json({ message: 'Order updated successfully' });
      } else {
        // Insérer une nouvelle commande
        const { data, error } = await supabase.from('orders').insert([{
          id: orderNumber,
          status: "started",
          amount,
          email,
          name,
          phone,
          address: `${address}, ${postal}, ${city}`,
          user_ip: `${userLocation.ip}`,
          cart: JSON.stringify(simplifiedCart),
          created_at: new Date().toISOString(),
        }]);

        if (error) {
          console.error('Error inserting order into Supabase:', error);
          throw new Error('Failed to create order in database');
        }

        res.status(200).json({ message: 'Order created successfully', data });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};