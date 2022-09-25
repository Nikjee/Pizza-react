export const addPizzaToCart = (pizzaObj) => ({
  type: 'ADD_PIZZA_CART',
  payload: pizzaObj,
})

export const clearCart = () => ({
  type: 'CLEAR_CART',
})

export const removeCartItem = (pizzaObj) => ({
  type: 'REMOVE_CART_ITEM',
  payload: pizzaObj,
})

export const plusCartItem = (pizzaObj) => ({
  type: 'PLUS_CART_ITEM',
  payload: pizzaObj,
})

export const minusCartItem = (pizzaObj) => ({
  type: 'MINUS_CART_ITEM',
  payload: pizzaObj,
})
