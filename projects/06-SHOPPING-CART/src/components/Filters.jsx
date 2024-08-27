import { useState, useId } from 'react'
import './Filters.css'
import { useFilters } from '../hooks/useFilters'

export function Filters () {
    const { setFilters } = useFilters() 
    const [minPrice, setMinPrice] = useState(0) // iniciamos el estado con el valor minimo 0
    const minPriceFilterId = useId()
    const categoryFilterId = useId()

    const handleChangeMinPrice = (event) => { // maneja el onChange del input de rango de precio
        setMinPrice(event.target.value) //Actualiza el estado local minPrice con el valor actual del input de rango
        setFilters(prevState => ({ // llama a la funcion onChange para actualizar el estado del filtro global del componente App
            ...prevState, // prevState guarda el valor anterior de input?
            minPrice: event.target.value
        }))
    }

    const handleChangeCategory = (event) => {
        setFilters(prevState => ({
            ...prevState,
            category: event.target.value
        }))
    }

    return (
        <section className="filters">

            <div>
                <label htmlFor={minPriceFilterId}>Precio a partir de:</label>
                <input 
                    type='range'
                    id={minPriceFilterId}
                    min='0'
                    max='1000' 
                    onChange={handleChangeMinPrice}
                />
                <span>${minPrice}</span>
            </div>

            <div>
                <label htmlFor={categoryFilterId}>Categoria</label>
                <select id={categoryFilterId} onChange={handleChangeCategory}>
                    <option value='all'>Todas</option>
                    <option value='laptops'>Portatiles</option>
                    <option value='smartphones'>Celulares</option>
                </select>
            </div>
        </section>
    )
}