import Weather from './Weather'

const Country = ({country}) => {
  return (
    <>
      <h1 key={country.name.common}> {country.name.common} </h1>
      <p key={country.capital}>capital {country.capital}</p>
      <p key={country.area}> area {country.area}</p>
      <h3> languages: </h3>
      <ul key={country.languages}>
        {Object.values(country.languages).map(language => 
          <li key={language}>
            {language}
          </li>)}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common} flag`} />
      <Weather country={country} />
    </>
  )
}

export default Country;
