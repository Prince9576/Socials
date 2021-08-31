import React, { useState } from "react";
import { Search } from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import styles from "./Search.module.css";
import cookie from "js-cookie";
let cancel;

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const { value } = e.target;
    setLoading(true);
    setQuery(value);
    try {
      cancel && cancel();
      // const CancelToken = axios.CancelToken;
      const token = cookie.get("token");
      const results = await axios.get(`${baseUrl}/api/search/${value}`, {
        headers: {
          Authorization: token,
        },
        // cancelToken: new CancelToken((canceler) => {
        //   cancel = canceler;
        // }),
      });
      if (results.data.length === 0) return setLoading(false);
      console.log("Search Result", results);
      setResults(results.data);
    } catch (err) {
      console.error("Error Searching", err);
    }
  };

  return (
    <Search
      className={styles["search-wrapper"]}
      onBlur={() => results.length > 0 && setResults([])}
      loading={loading}
      value={query}
      results={results}
      resultRenderer={ResultRenderer}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => {
        console.log("Search Response", data);
      }}
    ></Search>
  );
};

const ResultRenderer = (props) => {
  console.log(props);
  return <div></div>;
};

export default SearchComponent;
