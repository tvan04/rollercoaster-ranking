function Searchbar (props) {
    function coasterLookup() {
        //use an api to look up coasters
        
    }
  return (
    <div className='searchbar'>
      <input
        type='text'
        placeholder='Search Coasters'
        value={props.value}
        onChange={props.onChange}
        onkeyup="coasterLookup()"
      />
    </div>
  )
}

export default Searchbar