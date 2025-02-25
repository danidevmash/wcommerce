import Hero from '@/app/components/Hero';
import Link from 'next/link';
import { getStoresProducts } from '../lib/stores-api';

export default async function HomePage() {
  try {
    console.log('Fetching products...');
    const products = await getStoresProducts();

    if (!products || products.length === 0) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Products</h1>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <p className="text-yellow-800">No products found. Please check that:</p>
            <ul className="list-disc ml-6 mt-2 text-yellow-700">
              <li>Your STORES.jp API key is correct</li>
              <li>Your store has published products</li>
              <li>The API endpoint is accessible</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Hero />

        {/* Products Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold mb-8">Our Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow"
              >
                {product.image_urls[0] && (
                  <img 
                    src={product.image_urls[0]} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                {product.variations[0] && (
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    ¥{product.variations[0].sales_price.toLocaleString()}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h2 className="text-red-800 font-semibold">Error loading products</h2>
          <p className="text-red-700 mt-2">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <p className="text-red-600 mt-2 text-sm">
            Please check your API configuration and the browser console for more details.
          </p>
        </div>
      </div>
    );
  }
}
