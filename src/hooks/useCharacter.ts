import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ResponseAPI } from "../interface";

const useCharater = () => {
  const { data, error, fetchNextPage, status, hasNextPage } = useInfiniteQuery(
    /*
      useInfiniteQuery require severla parameters: 
        queryKey(used as a key to manage cache storage), 
        queryFn(it returns a promise), 
        options( it will contains getNextPageParam(which is a function that return the information for the next query to the API)) 
    */

    ["characters"],

    ({ pageParam = 1 }) =>
      fetch(
        `https://rickandmortyapi.com/api/character/?page=${pageParam}`
      ).then((res) => res.json()),

    {
      getNextPageParam: (lastPage: ResponseAPI) => {
        const previousPage = lastPage.info.prev
          ? +lastPage.info.prev.split("=")[1]
          : 0;
        const currentPage = previousPage + 1;

        if (currentPage === lastPage.info.pages) return false;
        return currentPage + 1;
      },
    }
  );

  const characters = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        return {
          info: page.info,
          results: [...prev.results, ...page.results],
        };
      }),
    [data]
  );

  return {
    error,
    fetchNextPage,
    status,
    hasNextPage,
    characters,
    data,
  };
};

export default useCharater;
