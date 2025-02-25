"use client";

import type { StoresProduct } from "@/lib/stores-api";
import { type ReactNode, createContext, useContext, useReducer } from "react";

interface CartItem {
	product: StoresProduct;
	quantity: number;
	variationId?: string;
}

interface CartState {
	items: CartItem[];
	isOpen: boolean;
}

type CartAction =
	| { type: "ADD_ITEM"; payload: CartItem }
	| {
			type: "REMOVE_ITEM";
			payload: { productId: string; variationId?: string };
	  }
	| {
			type: "UPDATE_QUANTITY";
			payload: { productId: string; variationId?: string; quantity: number };
	  }
	| { type: "CLEAR_CART" }
	| { type: "SET_IS_OPEN"; payload: boolean };

const initialState: CartState = {
	items: [],
	isOpen: false,
};

const CartContext = createContext<
	| {
			state: CartState;
			dispatch: React.Dispatch<CartAction>;
	  }
	| undefined
>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD_ITEM": {
			const existingItemIndex = state.items.findIndex(
				(item) =>
					item.product.id === action.payload.product.id &&
					item.variationId === action.payload.variationId,
			);

			if (existingItemIndex > -1) {
				const newItems = [...state.items];
				newItems[existingItemIndex].quantity += action.payload.quantity;
				return { ...state, items: newItems };
			}

			return { ...state, items: [...state.items, action.payload] };
		}

		case "REMOVE_ITEM": {
			return {
				...state,
				items: state.items.filter(
					(item) =>
						!(
							item.product.id === action.payload.productId &&
							item.variationId === action.payload.variationId
						),
				),
			};
		}

		case "UPDATE_QUANTITY": {
			return {
				...state,
				items: state.items.map((item) =>
					item.product.id === action.payload.productId &&
					item.variationId === action.payload.variationId
						? { ...item, quantity: action.payload.quantity }
						: item,
				),
			};
		}

		case "CLEAR_CART":
			return { ...state, items: [] };

		case "SET_IS_OPEN":
			return { ...state, isOpen: action.payload };

		default:
			return state;
	}
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	return (
		<CartContext.Provider value={{ state, dispatch }}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}

// Helper hooks for common cart operations
export function useCartActions() {
	const { dispatch } = useCart();

	return {
		addItem: (product: StoresProduct, quantity = 1, variationId?: string) => {
			dispatch({
				type: "ADD_ITEM",
				payload: { product, quantity, variationId },
			});
		},
		removeItem: (productId: string, variationId?: string) => {
			dispatch({
				type: "REMOVE_ITEM",
				payload: { productId, variationId },
			});
		},
		updateQuantity: (
			productId: string,
			quantity: number,
			variationId?: string,
		) => {
			dispatch({
				type: "UPDATE_QUANTITY",
				payload: { productId, variationId, quantity },
			});
		},
		clearCart: () => dispatch({ type: "CLEAR_CART" }),
		setIsOpen: (isOpen: boolean) =>
			dispatch({ type: "SET_IS_OPEN", payload: isOpen }),
	};
}
