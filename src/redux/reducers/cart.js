const initialState = {
  PizzaItems: {},
  totalPrice: 0,
  totalCount: 0,
}

const getTotalPizzaPrice = (arr) =>
  arr.reduce((sum, obj) => obj.price * obj.count + sum, 0)

const getTotalPizzaCount = (arr) => arr.reduce((sum, obj) => obj.count + sum, 0)

const getTotalCount = (pizzas) =>
  Object.keys(pizzas).reduce((sum, idx) => pizzas[idx].totalCount + sum, 0)

const getTotalPrice = (pizzas) =>
  Object.keys(pizzas).reduce((sum, idx) => pizzas[idx].totalPrice + sum, 0)

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART': {
      let currentP, newItems

      // If there is no such pizza then just add it
      if (!state.PizzaItems[action.payload.id]) {
        currentP = [action.payload]
        newItems = {
          ...state.PizzaItems,
          [action.payload.id]: {
            items: currentP,
            totalPrice: getTotalPizzaPrice(currentP),
            totalCount: getTotalPizzaCount(currentP),
          },
        }
        //If pizza already exists
      } else {
        let pizzaArr = [...state.PizzaItems[action.payload.id].items]
        //Search for its index
        const i = pizzaArr.findIndex(
          (pizza) =>
            pizza.type === action.payload.type &&
            pizza.size === action.payload.size
        )
        //if found
        if (i > -1) {
          newItems = {
            ...state.PizzaItems,
          }
          //Increase count of pizza = added another pizza
          newItems[action.payload.id].items[i].count += 1

          //Count the total price of this particular pizza
          newItems[action.payload.id].items[i].totalPrice =
            newItems[action.payload.id].items[i].price *
            newItems[action.payload.id].items[i].count

          //Count total price and how many of them of all pizzas same type
          newItems[action.payload.id].totalPrice = getTotalPizzaPrice(
            newItems[action.payload.id].items
          )

          newItems[action.payload.id].totalCount = getTotalPizzaCount(
            newItems[action.payload.id].items
          )

          //Return state and calculate the total price of the cart and its amount
          return {
            ...state,
            PizzaItems: newItems,
            totalCount: getTotalCount(state.PizzaItems),
            totalPrice: getTotalPrice(state.PizzaItems),
          }
        } else {
          //If pizza exists but its a new type or size then add it
          currentP = [
            ...state.PizzaItems[action.payload.id].items,
            action.payload,
          ]
          newItems = {
            ...state.PizzaItems,
            [action.payload.id]: {
              items: currentP,
              totalPrice: getTotalPizzaPrice(currentP),
              totalCount: getTotalPizzaCount(currentP),
            },
          }
        }
        // if (!newItems) {
        //   return {
        //     ...state,
        //     totalCount,
        //     totalPrice,
        //   }
        // }
      }

      return {
        ...state,
        PizzaItems: newItems,
        totalCount: getTotalCount(newItems),
        totalPrice: getTotalPrice(newItems),
      }
    }

    case 'REMOVE_CART_ITEM': {
      const newItems = {
        ...state.PizzaItems,
      }
      let pizzaArr = [...state.PizzaItems[action.payload.id].items]

      const i = pizzaArr.findIndex(
        (pizza) =>
          pizza.type === action.payload.type &&
          pizza.size === action.payload.size
      )
      const currentTotalPrice = newItems[action.payload.id].items[i].totalPrice
      const currentTotalCount = newItems[action.payload.id].items[i].count

      newItems[action.payload.id].items.splice(i, 1)
      return {
        ...state,
        PizzaItems: newItems,
        totalPrice: state.totalPrice - currentTotalPrice,
        totalCount: state.totalCount - currentTotalCount,
      }
    }

    case 'PLUS_CART_ITEM': {
      let pizzaArr = [...state.PizzaItems[action.payload.id].items]

      const i = pizzaArr.findIndex(
        (pizza) =>
          pizza.type === action.payload.type &&
          pizza.size === action.payload.size
      )

      state.PizzaItems[action.payload.id].items[i].count += 1
      state.PizzaItems[action.payload.id].items[i].totalPrice =
        state.PizzaItems[action.payload.id].items[i].price *
        state.PizzaItems[action.payload.id].items[i].count
      state.PizzaItems[action.payload.id].totalPrice = getTotalPizzaPrice(
        state.PizzaItems[action.payload.id].items
      )
      state.PizzaItems[action.payload.id].totalCount = getTotalPizzaCount(
        state.PizzaItems[action.payload.id].items
      )
      return {
        ...state,
        totalCount: getTotalCount(state.PizzaItems),
        totalPrice: getTotalPrice(state.PizzaItems),
      }
    }

    case 'MINUS_CART_ITEM': {
      let pizzaArr = [...state.PizzaItems[action.payload.id].items]

      const i = pizzaArr.findIndex(
        (pizza) =>
          pizza.type === action.payload.type &&
          pizza.size === action.payload.size
      )

      if (state.PizzaItems[action.payload.id].items[i].count > 1) {
        state.PizzaItems[action.payload.id].items[i].count -= 1
        state.PizzaItems[action.payload.id].items[i].totalPrice =
          state.PizzaItems[action.payload.id].items[i].price *
          state.PizzaItems[action.payload.id].items[i].count
        state.PizzaItems[action.payload.id].totalPrice = getTotalPizzaPrice(
          state.PizzaItems[action.payload.id].items
        )
        state.PizzaItems[action.payload.id].totalCount = getTotalPizzaCount(
          state.PizzaItems[action.payload.id].items
        )
        return {
          ...state,
          totalCount: getTotalCount(state.PizzaItems),
          totalPrice: getTotalPrice(state.PizzaItems),
        }
      }
      return {
        ...state,
      }
    }

    case 'CLEAR_CART':
      return { totalPrice: 0, totalCount: 0, PizzaItems: {} }

    default:
      return state
  }
}

export default cart
