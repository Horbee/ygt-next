import { useRouter } from "next/router";
import { useCallback, useEffect, useReducer } from "react";

import type { EventActions, EventPaginationState } from "./types";
import type { ParsedUrlQuery } from "querystring";
import type { EventFilterType } from "../../types";

const initialState = (query: ParsedUrlQuery | null): EventPaginationState => {
  const initialType = (
    typeof query?.type === "string"
      ? [query.type]
      : Array.isArray(query?.type)
      ? query!.type
      : []
  ) as EventFilterType[];

  const initialPage =
    typeof query?.page === "string" && !isNaN(parseInt(query.page, 10))
      ? parseInt(query.page, 10)
      : 1;

  return {
    selectedFilter: initialType,
    page: initialPage,
    pageSize: 8,
  };
};

const eventPaginationReducer = (
  state: EventPaginationState,
  action: EventActions
): EventPaginationState => {
  switch (action.type) {
    case "SET_EVENT_FILTER":
      return { ...state, selectedFilter: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    default:
      return { ...state };
  }
};

export const useEventPagination = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    eventPaginationReducer,
    initialState(router.query)
  );

  useEffect(() => {
    router.push({
      pathname: "/events",
      query: {
        type: state.selectedFilter,
        page: state.page,
      },
    });
  }, [state]);

  const toggleEventFilter = useCallback(
    (value: EventFilterType) => {
      if (state.selectedFilter.includes(value)) {
        dispatch({
          type: "SET_EVENT_FILTER",
          payload: state.selectedFilter.filter((f) => f !== value),
        });
      } else {
        dispatch({ type: "SET_EVENT_FILTER", payload: [...state.selectedFilter, value] });
      }
    },
    [state]
  );

  const setPage = useCallback((value: number) => {
    dispatch({ type: "SET_PAGE", payload: value });
  }, []);

  return { ...state, toggleEventFilter, setPage };
};
