export type StoresProduct = {
  id: string;
  name: string;
  created_at: string;
  status: 'shown' | 'hidden' | 'unlisted';
  image_urls: string[];
  limited_quantity: number;
  description: string;
  reduced_tax: boolean;
  type: 'regular' | 'ticket' | 'subscription' | 'digital_content';
  variations: {
    id: string;
    name: string;
    quantity: number | null;
    code: string | null;
    barcode: string | null;
    sales_price: number;
    regular_price: number;
    discount_amount: number;
    discount_rate: number;
  }[];
  category_ids: string[] | null;
  delivery_method_ids: {
    domestic?: string | null;
    overseas?: string | null;
  };
  preorder_sales?: {
    start_month: string;
    end_month: string;
    start_period: 'early' | 'middle' | 'late';
    end_period: 'early' | 'middle' | 'late';
  } | null;
  sales_period?: {
    period_start_at: string;
    period_end_at: string;
  } | null;
};

export async function getStoresProducts(): Promise<StoresProduct[]> {
  try {
    // First check if we have the API key
    if (!process.env.STORES_API_KEY) {
      throw new Error('STORES_API_KEY is not set in environment variables');
    }

    const url = 'https://api.stores.dev/retail/202211/items';
    console.log('Starting API request to:', url);

    // Log the headers we're sending (without the actual API key)
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer [HIDDEN]'
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.STORES_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store' // Disable caching for testing
    });

    // Log response details
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      };
      console.error('API Error Details:', errorDetails);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Log the structure of the response
    console.log('Response data structure:', {
      type: typeof data,
      hasItems: Boolean(data?.items),
      keys: Object.keys(data || {})
    });

    if (data && data.items && Array.isArray(data.items)) {
      console.log(`Successfully fetched ${data.items.length} products`);
      return data.items;
    }

    throw new Error(`Unexpected API response structure: ${JSON.stringify(data)}`);

  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown Error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      apiKey: process.env.STORES_API_KEY ? 'Present' : 'Missing'
    };
    
    console.error('Detailed error in getStoresProducts:', errorDetails);
    throw error; // Re-throw to be handled by the page component
  }
}

// Optional: Add function to fetch a single product
export async function getStoresProduct(productId: string): Promise<StoresProduct | null> {
  try {
    if (!process.env.STORES_API_KEY || !process.env.STORES_SHOP_ID) {
      console.error('Missing required environment variables:', {
        hasApiKey: !!process.env.STORES_API_KEY,
        hasShopId: !!process.env.STORES_SHOP_ID
      });
      return null;
    }

    // Log the request details
    console.log('Fetching product with:', {
      productId,
      shopId: process.env.STORES_SHOP_ID,
      hasApiKey: !!process.env.STORES_API_KEY
    });

    // First try to get all products and find the specific one
    const products = await getStoresProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
      console.log('Found product in list:', {
        id: product.id,
        name: product.name
      });
      return product;
    }

    console.log('Product not found in list, trying direct fetch');
    
    // If not found, try direct fetch (though this might not be supported based on the OpenAPI spec)
    const url = `https://api.stores.dev/retail/202211/shops/${process.env.STORES_SHOP_ID}/items/${productId}`;
    console.log('Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.STORES_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    // Log response details
    console.log('Response details:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        productId
      });
      return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Detailed error in getStoresProduct:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      productId
    });
    return null;
  }
} 