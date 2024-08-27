import './App.css'
// import { useRef } from 'react' // es un hook que permite crear una referencia mutable que existe durante todo el ciclo de vidad de un componente(cada ves que cambia el componente no lo renderiza otra vez)
import { useMovies } from './hooks/useMovies'
import { Movies } from './componentes/Movies'
import { useEffect, useState, useRef, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('Pelicula no encontrada')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se puede buscar peliculas con numeros')
      return
    }

    if (search.length < 2) {
      setError('Debe tener por lo menos 2 caracteres')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch() // como se sabe que es error si nunca defino que es error en use Search?
  const { movies, loading, getMovies } = useMovies({ search, sort }) // por que separamos el recivr movies, search.. y search, sort? // separaramos el componentes logicos de los visuales

  const debouncedGetMovies = useCallback(
    debounce(search => {
      console.log('search', search)
      getMovies({ search })
    }, 300)
    , [getMovies] // cada ves que se ejecuta la funcion
  )

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search })
  }

  const handleSort = () => { // que hace esta funcion?, donde se usa el sort y como afecta esto al orden de las peliculas? :  se pasa como parámetro al hook useMovies. Dentro de useMovies, afecta al orden de las peliculas, organizandolas en orden alfabetico
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(event.target.value)
    debouncedGetMovies(newSearch) // por que crear new search, en ves de pasarle el mismo valo de new search?:
  }

  return (
    <div className='page'>

      <header>
        <h1>Buscador de Peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input style={{ border: '1px solid transparent', borderColor: error ? 'red' : 'transparent' }} onChange={handleChange} value={search} name='query' placeholder='Avengers, Star Wars, The Matrix ...' />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cragando...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App