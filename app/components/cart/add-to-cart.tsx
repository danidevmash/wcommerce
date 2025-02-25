"use client";

import type { StoresProduct } from "@/lib/stores-api";
import { useState } from "react";
import { useCartActions } from "./context";

interface AddToCartButtonProps {
	product: StoresProduct;
	availableVariations?: {
		id: string;
		name: string;
		quantity: number | null;
	}[];
}

export function AddToCartButton({
	product,
	availableVariations,
}: AddToCartButtonProps) {
	const { addItem, setIsOpen } = useCartActions();
	const [selectedVariation, setSelectedVariation] = useState(
		availableVariations?.[0]?.id,
	);
	const [quantity, setQuantity] = useState(1);

	const handleAddToCart = () => {
		addItem(product, quantity, selectedVariation);
		setIsOpen(true);
	};

	return (
		<div className="flex flex-col gap-4">
			{availableVariations && availableVariations.length > 0 && (
				<div className="flex flex-col gap-2">
					<label htmlFor="variation" className="text-sm font-medium">
						Select Option
					</label>
					<select
						id="variation"
						value={selectedVariation}
						onChange={(e) => setSelectedVariation(e.target.value)}
						className="rounded-md border border-gray-300 px-4 py-2"
					>
						{availableVariations.map((variation) => (
							<option key={variation.id} value={variation.id}>
								{variation.name}
								{variation.quantity !== null &&
									` (${variation.quantity} available)`}
							</option>
						))}
					</select>
				</div>
			)}

			<div className="flex flex-col gap-2">
				<label htmlFor="quantity" className="text-sm font-medium">
					Quantity
				</label>
				<input
					type="number"
					id="quantity"
					min="1"
					value={quantity}
					onChange={(e) =>
						setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
					}
					className="rounded-md border border-gray-300 px-4 py-2"
				/>
			</div>

			<button
				onClick={handleAddToCart}
				className="mt-2 rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
			>
				Add to Cart
			</button>
		</div>
	);
}
