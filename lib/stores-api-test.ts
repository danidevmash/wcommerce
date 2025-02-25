const testStoresApiConnection = async () => {
  const apiKey = process.env.STORES_API_KEY;
  const shopId = process.env.STORES_SHOP_ID;

  try {
    // STORES.jp API endpoint for products
    const response = await fetch('https://api.stores.jp/v1/products', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API Connection Successful!');
    console.log('First few products:', data.slice(0, 3));
    return data;

  } catch (error) {
    console.error('API Connection Error:', error);
    throw error;
  }
};

export { testStoresApiConnection };
