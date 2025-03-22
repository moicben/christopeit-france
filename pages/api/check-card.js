const axios = require('axios');

const bankLogos = {
    'BNP': 'https://mabanque.bnpparibas/content/dam/mabanque/generique/bnp-alone.png',
    'Générale': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx3w2FY3AaG-g0zjplqjILhW0ly5uZpmYzUw&s',
    'Agricole': 'https://cdn.worldvectorlogo.com/logos/credit-agricole-logo.png',
    'Mutuel': 'https://cdn.worldvectorlogo.com/logos/credit-mutuel.svg',
    'Postale': 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d4/Logo_La_Banque_postale_2022.svg/2560px-Logo_La_Banque_postale_2022.svg.png',
    'Caisse': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCcIO8dtcrkPGHeo_JQlSi8QwouQvxXLYlmA&s',
    'Populaire': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuhaxph_tElTKSS2iTGJcCPhJ12OoxDdebQQ&s',
    'LCL': 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/0b/Lcl_logo.png/2540px-Lcl_logo.png.png',
    'HSBC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png',
    'AXA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/AXA_logo.png/2048px-AXA_logo.png.png',
    'Boursorama': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Logo_Boursorama.svg/2560px-Logo_Boursorama.svg.png',
    'ING': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/ING_Group_N.V._logo.png/1280px-ING_Group_N.V._logo.png.png',
    'Fortuneo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fortuneo.svg/2560px-Fortuneo.svg.png',
    'Monabanq': 'https://w7.pngwing.com/pngs/152/360/png-transparent-monabanq-gris-hd-logo.png',
    'Nord': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Logo_-_Cr%C3%A9dit_du_Nord.svg/2560px-Logo_-_Cr%C3%A9dit_du_Nord.svg.png',
    'Hello': 'https://www.meilleurtaux.com/images/conso/guide/logo-hello-bank.jpg',
    'BforBank': 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/63/Logo_BforBank_2023.svg/2560px-Logo_BforBank_2023.svg.png',
    'Orange': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Logo_Orange_Bank.svg/1200px-Logo_Orange_Bank.svg.png',
    'N26': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/N26-branding-logo-web.png/1200px-N26-branding-logo-web.png',
    'Revolut': 'https://www.cdnlogo.com/logos/r/78/revolut.svg',
    'Wise': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Wise_Logo_512x124.svg',
    'Mastercard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.png/1280px-Mastercard-logo.png.png',
    'Visa': 'https://logo-marque.com/wp-content/uploads/2020/06/Visa-Logo.png'
};

const getBankLogo = (bankName, cardType) => {
    const lowerCaseBankName = bankName.toLowerCase();
    for (const key in bankLogos) {
        if (lowerCaseBankName.includes(key.toLowerCase())) {
            return bankLogos[key];
        }
    }
    // Return Mastercard or Visa logo if no bank logo is found
    if (cardType.toLowerCase() === 'mastercard') {
        return bankLogos['Mastercard'];
    } else if (cardType.toLowerCase() === 'visa') {
        return bankLogos['Visa'];
    }
    return '/favicon.png'; // Return default logo if no match is found
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { cardNumber } = req.body;
    const bin = cardNumber.substring(0, 6);

    try {
        const response = await axios.get(`https://data.handyapi.com/bin/${bin}`, {
            headers: {
                'x-api-key': 'PUB-0YANdb14U90gXZ5zVGYrRK'
            }
        });
        const bankName = response.data.Issuer ? response.data.Issuer : '';
        const cardType = response.data.Type ? response.data.Type : '';
        const cardScheme = response.data.Scheme ? response.data.Scheme : '';
        const cardCountry = response.data.Country ? response.data.Country.Name : '';
        const bankLogo = getBankLogo(bankName, cardType);
        
        res.status(200).json({ bankName, bankLogo, cardType, cardScheme, cardCountry });
    } catch (error) {
        console.error('Error fetching bank information:', error);
        res.status(200).json({ bankName: 'Unknown Bank', bankLogo: '/favicon.png', cardType: '', cardScheme: '', cardCountry: '' });
    }
}