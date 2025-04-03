import { supabase } from '../lib/supabase.js';

/**
 * Ajoute une colonne à la table "contents" si elle n'existe pas déjà.
 * @param {string} columnName - Le nom de la colonne à ajouter.
 * @param {string} columnType - Le type de la colonne (ex: 'text', 'integer', 'boolean').
 */
async function addColumnIfNotExists(columnName, columnType) {
  try {
    // Vérifie si la colonne existe déjà en utilisant pg_table_def
    const { data: existingColumns, error: fetchError } = await supabase
      .from('pg_table_def')
      .select('column_name')
      .eq('table_name', 'contents')
      .eq('column_name', columnName);

    if (fetchError) {
      throw new Error(`Erreur lors de la vérification de la colonne "${columnName}": ${fetchError.message}`);
    }

    if (existingColumns.length > 0) {
      console.log(`La colonne "${columnName}" existe déjà dans la table "contents".`);
      return;
    }

    // Ajoute la colonne si elle n'existe pas
    const { error: alterError } = await supabase.rpc('add_column_to_table', {
      table_name: 'contents',
      column_name: columnName,
      column_type: columnType,
    });

    if (alterError) {
      if (alterError.message.includes('duplicate_column')) {
        console.log(`La colonne "${columnName}" existe déjà dans la table "contents".`);
      } else {
        throw new Error(`Erreur lors de l'ajout de la colonne "${columnName}": ${alterError.message}`);
      }
    } else {
      console.log(`Colonne "${columnName}" ajoutée avec succès à la table "contents".`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

/**
 * Ajoute plusieurs colonnes à la table "contents".
 * @param {Array<{ name: string, type: string }>} columns - Liste des colonnes à ajouter.
 */
async function addColumns(columns) {
  for (const column of columns) {
    await addColumnIfNotExists(column.name, column.type);
  }
}

// Liste des nouvelles colonnes à ajouter
const newColumns = [
  { name: 'checkoutFormDeliveryInfo', type: 'text' },
  { name: 'checkoutFormAddressPlaceholder', type: 'text' },
  { name: 'checkoutFormSuitePlaceholder', type: 'text' },
  { name: 'checkoutFormPostalPlaceholder', type: 'text' },
  { name: 'checkoutFormCityPlaceholder', type: 'text' },
  { name: 'checkoutFormCustomerAccount', type: 'text' },
  { name: 'checkoutFormEmailPlaceholder', type: 'text' },
  { name: 'checkoutFormNamePlaceholder', type: 'text' },
  { name: 'checkoutFormPhonePlaceholder', type: 'text' },
  { name: 'checkoutFormProceedToPayment', type: 'text' },
  { name: 'checkoutFormPaymentMethod', type: 'text' },
  { name: 'checkoutFormCardInfo', type: 'text' },
  { name: 'checkoutFormCardFees', type: 'text' },
  { name: 'checkoutFormBankTransferInfo', type: 'text' },
  { name: 'checkoutFormPaypalUnavailable', type: 'text' },
  { name: 'checkoutFormConfirm', type: 'text' },
  { name: 'checkoutFormPayByCard', type: 'text' },
  { name: 'checkoutFormEnterPaymentInfo', type: 'text' },
  { name: 'checkoutFormSecurePayment', type: 'text' },
  { name: 'checkoutFormPayByBankTransfer', type: 'text' },
  { name: 'checkoutFormBankTransferInstructions', type: 'text' },
  { name: 'checkoutFormAccountHolder', type: 'text' },
  { name: 'checkoutFormIBAN', type: 'text' },
  { name: 'checkoutFormBIC', type: 'text' },
  { name: 'checkoutFormOrderReference', type: 'text' },
  { name: 'checkoutFormAmount', type: 'text' },
  { name: 'checkoutFormCurrency', type: 'text' },
  { name: 'checkoutFormBankTransferConfirmation', type: 'text' },
  { name: 'checkoutFormTrackOrder', type: 'text' },
];

// Exécute le script pour ajouter les colonnes
addColumns(newColumns);