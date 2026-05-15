import { useState, useEffect } from "react";
import { PokemonModal } from "./components/pokemonModal";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");

  function PokemonClick(item) {
    console.log(item.url);
    setUrl(item.url);
    setIsModalOpen(true);
  }

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
      .then((res) => res.json())
      .then((json) => {
        setPokemon(json.results);
        setDataIsLoading(true);
        console.log(pokemon);
      });
  }, []);
  return (
    <div className="h-screen bg-gradient-to-b from-lime-100 to-lime-300">
      <div className="text-center font-bold">Pokedex</div>
      {pokemon.map((item) => (
        <div className="item" key={item.name}>
          <ol>
            <div onClick={() => PokemonClick(item)}>{item.name}</div>
            {/* {isModalOpen && } */}
          </ol>
        </div>
      ))}{" "}
      {/* {isModalOpen && <PokemonModal url={url} />} */}
      {/* <input
        className="w-60 placeholder:text-slate-400 border rounded-md"
        placeholder="Type pokemon name here..."
      ></input>
      <button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
        Search
      </button> */}
    </div>
  );
}

export default App;
