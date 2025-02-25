import { getStoresProduct } from '@/lib/stores-api';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params
}: {
  params: { id: string }
}) {
  const product = await getStoresProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
            {product.image_urls[0] && (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="basis-full lg:basis-2/6">
          <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
            <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
            {product.variations[0] && (
              <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
                ¥{product.variations[0].sales_price.toLocaleString()}
              </p>
            )}
          </div>

          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              {product.description}
            </p>
          </div>

          {product.variations.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold">Variations</h2>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((variation) => (
                  <div
                    key={variation.id}
                    className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                  >
                    <p className="font-medium">{variation.name}</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      ¥{variation.sales_price.toLocaleString()}
                    </p>
                    {variation.quantity !== null && (
                      <p className="text-sm text-neutral-500">
                        Stock: {variation.quantity}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 