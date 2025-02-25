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
  if (!process.env.STORES_API_KEY) {
    console.error('STORES_API_KEY is not set in environment variables');
    return null;
  }

  try {
    const url = `https://api.stores.dev/retail/202211/items/${productId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.STORES_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const product = await response.json();
    return product;

  } catch (error) {
    console.error('Error fetching single product:', error);
    return null;
  }
} 