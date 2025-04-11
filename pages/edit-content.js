import React, { useState } from 'react';
import { fetchData } from 'lib/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpybtzxqypswjiizkzja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweWJ0enhxeXBzd2ppaXpremphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDE1NjYsImV4cCI6MjA1ODExNzU2Nn0.08Uh9FjenwJ23unlZxyXDDDf4ZurGPjZai1cKBB6r9o'

const supabase = createClient(supabaseUrl, supabaseKey);  

const EditContent = ({ content }) => {
  // Initialize form data with the fetched content record
  const [formData, setFormData] = useState(content);
  const [message, setMessage] = useState('');

  // Update form state on every change
  const handleChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  // Submit updated data to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('contents')
      .update(formData)
      .eq('id', formData.id);
    if (error) {
      setMessage(`Erreur lors de la mise à jour: ${error.message}`);
    } else {
      setMessage('Mise à jour réussie!');
    }
  };

  return (
    <div className="container">
      <h1>Modifier le contenu</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => {
          // Skip the id field from editing
          if (key === 'id') return null;
          return (
            <div key={key}>
              <label htmlFor={key}>{key}</label>
              <input
                type="text"
                id={key}
                value={formData[key] || ''}
                onChange={(e) => handleChange(e, key)}
              />
            </div>
          );
        })}
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export async function getStaticProps() {
  // Retrieve the "contents" data for the current shop
  const contents = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  if (!contents || contents.length === 0) {
    return { notFound: true };
  }
  // Assume we modify the first record for simplicity
  return {
    props: {
      content: contents[0],
    },
  };
}

export default EditContent;