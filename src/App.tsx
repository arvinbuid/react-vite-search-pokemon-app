import {useState} from "react";
import axios from "axios";
import {Button} from "@/components/ui/button";
import {ThemeProvider} from "@/components/ui/theme-provider";
import {ModeToggle} from "./components/ui/mode-toggle";
import {Input} from "@/components/ui/input";
import {Card, CardHeader} from "@/components/ui/card";

function App() {
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonChosen, setPokemonChosen] = useState(false);
  const [pokemon, setPokemon] = useState([
    {
      name: "",
      species: "",
      sprite: "",
      hp: "",
      atk: "",
      def: "",
      type: "",
    },
  ]);
  const controller = new AbortController();

  const searchPokemon = () => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setPokemon([
          {
            name: pokemonName,
            species: response.data.species.name,
            sprite: response.data.sprites.front_default,
            hp: response.data.stats[0].base_stat,
            atk: response.data.stats[1].base_stat,
            def: response.data.stats[2].base_stat,
            type: response.data.types[0].type.name,
          },
        ]);
        setPokemonChosen(true);
        controller.abort();
        setLoading(false);
      })
      .catch((error) => {
        error.message = "Could not fetch pokemon.";
        setError(error.message);
        setPokemonChosen(false);
        setLoading(false);
      });
  };

  const handleSearchButtonClick = () => {
    if (pokemonName.trim() === "") {
      console.log("please insert pokemon");
      return;
    }
    setError("");
    searchPokemon();
  };

  if (error) {
  }

  return (
    <>
      <div className='flex flex-col items-center grow'>
        <div className='mt-6'>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <ModeToggle />
          </ThemeProvider>
        </div>

        <h2 className='text-4xl p-8'>Pokemon Stats</h2>
        <div className='flex w-full max-w-sm items-center space-x-2'>
          <Input
            type='text'
            placeholder='search pokemon...'
            onChange={(e) => setPokemonName(e.target.value)}
          />
          <Button onClick={handleSearchButtonClick}>Search</Button>
        </div>

        {isLoading ? (
          <h2>Loading...</h2>
        ) : pokemonChosen ? (
          <div className='mt-4 p-8 flex flex-col text-2xl'>
            <Card className='p-8 flex flex-col items-center gap-2 text-1xl shadow-xl'>
              <CardHeader>
                <img src={pokemon[0].sprite} />
              </CardHeader>
              <p>Name: {pokemon[0].name}</p>
              <p>HP: {pokemon[0].hp}</p>
              <p>Defense: {pokemon[0].def}</p>
              <p>Attack: {pokemon[0].atk}</p>
              <p>Type: {pokemon[0].type}</p>
            </Card>
          </div>
        ) : (
          <div className='error-message text-3xl mt-4'>{error}</div>
        )}
      </div>
    </>
  );
}

export default App;
