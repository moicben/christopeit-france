import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Configuration de l'API OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chemin du fichier source et du fichier de sortie
const sourceFilePath = path.join('detailed-blog-christopeit.json');
const outputFilePath = path.join('translated-blog-fr.json');

// Fonction pour générer un slug optimisé
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .trim();
};

// Fonction pour générer un titre optimisé via l'API OpenAI
const generateOptimizedTitle = async (content) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `Tu es un assistant spécialisé en création de titres optimisés pour le SEO et le SXO. `,
      },
      {
        role: 'user',
        content: `
        Traduis en français et optimise le titre suivant :  ${content} \n
        Ne changez pas le sens du titre, mais assurez-vous qu'il est clair, concis et attrayant pour les lecteurs de ma boutique. \n
        Le titre ne doit pas dépasser les 65 caractères (important).  \n
        n'intègre pas " " ou ' ' dans le titre.  \n
        N'intègre par Christopeit Sport dans le titre.  \n
        Optimise le titre pour le SXO et son SEO sur des mots-clés pertinents.  \n
        Réponds en français uniquement avec le titre de rédigé.  \n
        Voici le titre que tu as traduis et optimisé :  \n
        `, 
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo', 
      messages: messages,
      max_tokens: 100, 
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur lors de la génération du titre avec OpenAI :', error);
    throw error;
  }
};

// Fonction pour traduire et optimiser le contenu via l'API OpenAI
const translateAndOptimizeContent = async (content) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `Tu es un assistant spécialisé en traduction et optimisation de contenu pour le SEO et le SXO. `,
      },
      {
        role: 'user',
        content: `
        Traduisez le contenu suivant en français : ${content} \n \n
        Puis, suis ces instructions pour l'optimiser : \n
        Enrichis-le et formate-le au format  HTML. \n
        Ne générez pas de balises globales comme <html> ou <body>. \n
        Concentre-toi uniquement sur les sections nécessaires avec une structure complète avec : , <h2>, <h3>, <h4>, <p>, et <li>. \n
        N'inclus pas le tirte de l'article et de balise <h1> \n
        Le contenu doit être unique, informatif et engageant pour les lecteurs. \n
        Le contenu doit faire environ 750 mots. \n
        Intègre 2 listes à puces avec <ul> et <li> ! \n
        Supprimer les liens du contenu initiaux s'il y en a. \n
        Réponds en français uniquement avec le contenu traduit et optimisé. \n
        Voici le contenu que tu as traduit et optimisé : \n`
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // Utilisation du modèle GPT-4 pour une meilleure qualité
      messages: messages,
      max_tokens: 3800,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur lors de la traduction avec OpenAI :', error);
    throw error;
  }
};

// Fonction principale pour traduire et optimiser les articles
const translateAndOptimizeBlogs = async () => {
  try {
    // Lecture du fichier JSON source
    const data = fs.readFileSync(sourceFilePath, 'utf8');
    const blogs = JSON.parse(data);

    // Vérification si le fichier source est vide
    if (!blogs || blogs.length === 0) {
      console.error('Le fichier source est vide ou mal formé.');
      return;
    }

    // Limite du nombre d'articles à traiter
    const limit = 3 // Changez cette valeur pour ajuster le nombre d'articles à traiter
    const blogsToProcess = blogs.slice(0, blogs.length);

    // Traduction et optimisation des articles
    const translatedBlogs = [];
    for (const [index, blog] of blogsToProcess.entries()) {
      if (!blog.content || blog.content.trim() === '') {
        console.warn(`L'article ${index + 1} est vide. Il sera ignoré.`);
        continue;
      }

      console.log(`Traduction et optimisation de l'article ${index + 1}...`);

      // Génération du titre optimisé
      const title = await generateOptimizedTitle(blog.content);

      // Traduction et optimisation du contenu
      const translatedContent = await translateAndOptimizeContent(blog.content);

      // Génération du slug
      const slug = generateSlug(title);

      translatedBlogs.push({
        id: index + 1,
        slug,
        title,
        thumbnail: blog.thumbnail,
        content: translatedContent,
      });
    }

    // Vérification si des articles traduits existent
    if (translatedBlogs.length === 0) {
      console.error('Aucun article n\'a été traduit.');
      return;
    }

    // Écriture du fichier JSON traduit
    fs.writeFileSync(outputFilePath, JSON.stringify(translatedBlogs, null, 2), 'utf8');
    console.log('Fichier traduit et optimisé créé avec succès :', outputFilePath);
  } catch (error) {
    console.error('Erreur lors de la traduction et de l\'optimisation des blogs :', error);
  }
};

// Exécution de la fonction
translateAndOptimizeBlogs();