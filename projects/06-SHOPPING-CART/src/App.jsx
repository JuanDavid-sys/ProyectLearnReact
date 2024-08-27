import { products as initialProducts } from "./mocks/products" // que significa el as, y por que agregamos initiaProducts?: renombramos products a initialProducts
import { Products } from "./components/Products"
import { useState } from "react"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { IS_DEVELOPMENT } from "./config"
import { useFilters } from "./hooks/useFilters"

function App() {
  const [products] = useState(initialProducts) // iniciamos el estado products con el valor initialProducts
  const { filters, filterProducts } = useFilters()
  const filteredProducts = filterProducts(products)

  return (
    <>
    <Header />
    <Products products={filteredProducts} />
    {IS_DEVELOPMENT && <Footer filters={filters}/>}
    </>
  )
}

export default App
