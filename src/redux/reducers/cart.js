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

const _get = (obj, path) => {
  const [firstKey, ...keys] = path.split('.')
  return keys.reduce((val, key) => {
    return val[key]
  }, obj[firstKey])
}

const getTotalSum = (obj, path) => {
  return Object.values(obj).reduce((sum, obj) => {
    const value = _get(obj, path)
    return sum + value
  }, 0)
}

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART': {
      let currentP, newItems
      let totalCount = 0
      let totalPrice = 0

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
      } else {
        let pizzaArr = [...state.PizzaItems[action.payload.id].items]

        const i = pizzaArr.findIndex(
          (pizza) =>
            pizza.type === action.payload.type &&
            pizza.size === action.payload.size
        )
        if (i > -1) {
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
        } else {
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
        if (!newItems) {
          return {
            ...state,
            totalCount,
            totalPrice,
          }
        }
      }
      // const newItems = {
      //   ...state.items,
      //   [action.payload.id]: {
      //     items: currentPizzaItems,
      //     totalPrice: getTotalPrice(currentPizzaItems),
      //   },
      // }

      // const totalCount = getTotalSum(newItems, 'items.length')
      // const totalPrice = getTotalSum(newItems, 'totalPrice')

      return {
        ...state,
        PizzaItems: newItems,
        totalCount: getTotalCount(newItems),
        totalPrice: getTotalPrice(newItems),
      }
    }

    case 'REMOVE_CART_ITEM': {
      const newItems = {
        ...state.items,
      }
      const currentTotalPrice = newItems[action.payload].totalPrice
      const currentTotalCount = newItems[action.payload].items.length
      delete newItems[action.payload]
      return {
        ...state,
        items: newItems,
        totalPrice: state.totalPrice - currentTotalPrice,
        totalCount: state.totalCount - currentTotalCount,
      }
    }

    case 'PLUS_CART_ITEM': {
      const newObjItems = [
        ...state.items[action.payload].items,
        state.items[action.payload].items[0],
      ]
      const newItems = {
        ...state.items,
        [action.payload]: {
          items: newObjItems,
          totalPrice: getTotalPizzaPrice(newObjItems),
        },
      }

      const totalCount = getTotalSum(newItems, 'items.length')
      const totalPrice = getTotalSum(newItems, 'totalPrice')

      return {
        ...state,
        items: newItems,
        totalCount,
        totalPrice,
      }
    }

    case 'MINUS_CART_ITEM': {
      const oldItems = state.items[action.payload].items
      const newObjItems =
        oldItems.length > 1
          ? state.items[action.payload].items.slice(1)
          : oldItems
      const newItems = {
        ...state.items,
        [action.payload]: {
          items: newObjItems,
          totalPrice: getTotalPizzaPrice(newObjItems),
        },
      }

      const totalCount = getTotalSum(newItems, 'items.length')
      const totalPrice = getTotalSum(newItems, 'totalPrice')

      return {
        ...state,
        items: newItems,
        totalCount,
        totalPrice,
      }
    }

    case 'CLEAR_CART':
      return { totalPrice: 0, totalCount: 0, items: {} }

    default:
      return state
  }
}

export default cart
