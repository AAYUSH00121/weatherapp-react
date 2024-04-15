
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import WeatherPage from "./components/WeatherPage";

const citiesApi =
  "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20";


interface City {
  geoname_id: string;
  name: string;
  ascii_name: string;
  country_code: string;
  timezone: string;
}

interface ApiResponse {
  total_count: number;
  results: City[];
}

const App: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async (url: string, currentPage: number) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${url}&page=${currentPage}`);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: ApiResponse = await res.json();
        setCities((prevCities) => [...prevCities, ...data.results]);
        setTotalPages(Math.ceil(data.total_count / 20));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchCities(citiesApi, page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5 && page < totalPages && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, isLoading]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
    if (value.trim() !== "") {
      const filteredSuggestions = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city: City) => {
    setSearchQuery(city.name);
    setSuggestions([]);
    window.open(`/weather/${city.name}`, '_blank');
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <main className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-200 to-yellow-100">
            <section className="max-w-2xl p-4 flex flex-col items-center justify-center px-10 py-24 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded text-zinc-700 overflow-y-auto">
              <h1 className="flex p-5 max-w-xl justify-center text-black text-6xl">Weather App</h1>
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-t-none rounded-b overflow-hidden">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.geoname_id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">City Name</th>
                    <th className="px-4 py-2 flex justify-center">Country Code</th>
                    <th className="px-4 py-2">Timezone</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.geoname_id}>
                      <td className="border px-4 py-2">
                        <Link to={`/weather/${city.name}`} className="text-blue-500" target="_blank">
                          {city.name}
                        </Link>
                      </td>
                      <td className="border px-4 py-2 flex justify-center">{city.country_code}</td>
                      <td className="border px-4 py-2">{city.timezone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && <div className="mt-4">Loading more data...</div>}
            </section>
          </main>
        </Route>
        <Route path="/weather/:cityId">
          <WeatherPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;


