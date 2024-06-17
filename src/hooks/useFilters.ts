import {useEffect, useState} from "react";
// @ts-ignore
import {debounce} from "lodash";
import useLeadStore from "@/stores/useLeadsStore";

export default function (fetch: any) {
  const {filters} = useLeadStore();
  const [isFirst, setIsFirst] = useState(true);

  const debouncedFetch = debounce(
    (queryString: string) => fetch(queryString),
    500
  );

  useEffect(() => {
    let queryString = "";

    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== "" && value !== undefined) {
        queryString += `filter[${key}]=${value}&`;
      }
    }

    if (queryString !== "") {
      debouncedFetch(queryString);
    } else if (!isFirst) {
      fetch();
    }

    setIsFirst(false);

    return () => {
      debouncedFetch.cancel();
    };
  }, [filters]);

  return {filters};
}
