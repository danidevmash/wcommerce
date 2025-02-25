"use client";

import { useCartActions } from "@/app/components/cart/context";
import type { StoresProduct } from "@/lib/stores-api";
import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";

function SubmitButton({
	availableForSale,
	selectedVariantId,
}: {
	availableForSale: boolean;
	selectedVariantId: string | undefined;
}) {
	const buttonClasses =
		"relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
	const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

	if (!availableForSale) {
		return (
			<button type="button" disabled className={clsx(buttonClasses, disabledClasses)}>
				Out Of Stock
			</button>
		);
	}

	if (!selectedVariantId) {
		return (
			<button
				type="button"
				aria-label="Please select an option"
				disabled
				className={clsx(buttonClasses, disabledClasses)}
			>
				<div className="absolute left-0 ml-4">
					<PlusIcon className="h-5" />
				</div>
				Add To Cart
			</button>
		);
	}

	return (
		<button
			type="submit"
			aria-label="Add to cart"
			className={clsx(buttonClasses, {
				"hover:opacity-90": true,
			})}
		>
			<div className="absolute left-0 ml-4">
				<PlusIcon className="h-5" />
			</div>
			Add To Cart
		</button>
	);
}

export function AddToCart({ product }: { product: StoresProduct }) {
	const { addItem, setIsOpen } = useCartActions();
	const [selectedVariantId, setSelectedVariantId] = useState(
		product.variations[0]?.id
	);
	const [quantity, setQuantity] = useState(1);

	const selectedVariation = product.variations.find(
		(v) => v.id === selectedVariantId
	);
	const availableForSale = selectedVariation?.quantity !== 0;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedVariantId) {
			addItem(product, quantity, selectedVariantId);
			setIsOpen(true);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{product.variations.length > 0 && (
				<div className="flex flex-col gap-2">
					<label htmlFor="variation" className="text-sm font-medium">
						Select Option
					</label>
					<select
						id="variation"
						value={selectedVariantId}
						onChange={(e) => setSelectedVariantId(e.target.value)}
						className="rounded-md border border-gray-300 px-4 py-2"
					>
						{product.variations.map((variation) => (
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
					onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
					className="rounded-md border border-gray-300 px-4 py-2"
				/>
			</div>

			<SubmitButton
				availableForSale={availableForSale}
				selectedVariantId={selectedVariantId}
			/>
		</form>
	);
}
