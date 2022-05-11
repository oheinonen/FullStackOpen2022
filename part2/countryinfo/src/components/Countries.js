
const Countries = ({countriesToShow, setCountryToShow}) => {
  if(countriesToShow.length === 1)return null
  else if(countriesToShow.length >10){
    return (
      <>
        <p> Too many matches, specify another filter</p>
      </>
    )}
  else if(countriesToShow.length === 0){
    return (
      <>
        <p> Zero matches, specify another filter</p>
      </>
    )}
  else if(countriesToShow.length > 1){
    return(
      <>
        {countriesToShow.map(country =>
        <div key={country.name.common}> 
          <p>{country.name.common}
          <button onClick={() => setCountryToShow(country)}>
            show
          </button>
          </p>
        </div>
        )}

      </>
    )}
}

export default Countries;
