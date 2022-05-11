import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'
import Countries from './components/Countries'

const CountryFilter = ({countryFilter,setNewCountryFilter, setCountryToShow}) => {
  const handleCountryFilterChange = (event) => {
    setCountryToShow('')
    setNewCountryFilter(event.target.value)
    }
    return(
      <form>
      find countries <input value={countryFilter} onChange={handleCountryFilterChange} />           
      </form>
    )
}

const App = () => {
  
  const [countries, setCountries] = useState([]) 
  const [countryFilter, setNewCountryFilter] = useState('')
  const [countryToShow, setCountryToShow] = useState('')
  const countriesToShow = countryFilter.length
    ? countries.filter(country => 
                      country.name.common.toLowerCase()
                      .includes(countryFilter.toLowerCase()))
    : countries

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <CountryFilter countryFilter={countryFilter}
        setNewCountryFilter={setNewCountryFilter} 
        setCountryToShow={setCountryToShow}/>      
      {countryToShow ? (
        <Country country={countryToShow} />
      ): countriesToShow.length === 1 ? (
        <Country country={countriesToShow[0]} />
      ) : (    
        <div>   
          <Countries countriesToShow={countriesToShow}
            setCountryToShow={setCountryToShow}/>      
        </div>
    )}
    </div>
  )

}


export default App;
