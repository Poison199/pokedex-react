import { useEffect, useState } from "react";

export function PokemonModal({ url }) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPokemonData(data);
      });
  }, [url]);

  if (!pokemonData) return <div>Loading...</div>;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded">
        <h2 className="text-xl font-bold">{pokemonData.name}</h2>

        <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />

        <p>Height: {pokemonData.height}</p>
        <p>Weight: {pokemonData.weight}</p>
      </div>
    </div>
  );
}
