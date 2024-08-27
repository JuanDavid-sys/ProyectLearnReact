import { useContext } from "react"
import { FiltersContext } from "../context/filters"

export function useFilters () {
    const { filters, setFilters } = useContext(FiltersContext)
  
    const filterProducts = (products) => {
      return products.filter(product => { // tenemos todo el array de productos y solo vamos a mostrar aquellos que....
        return (
          product.price >= filters.minPrice && // precio mayor o igual al precio minimo
          (
            filters.category === 'all' || // si el filtro es all, muestra todos, pero si no es all....
            product.category === filters.category // muestra los productos que tengan el filter category
          )
        ) // para los productos que pasen las condiciones debuelve true
      })
    }
  
    return { filters, filterProducts, setFilters }
  }