export default function Search() {
  return (
    <>
      <h1>Search</h1>
      <form method="get" action="search">
        <label>
          Search <input name="term" type="text" />
        </label>
        <button type="submit">Search</button>
      </form>
    </>
  );
}
