import { useRouter } from "next/router";
import { useCallback, useEffect, useReducer } from "react";

import type { EventActions, EventPaginationState } from "./types";
import type { ParsedUrlQuery } from "querystring";
import type { EventType } from "../../types";

const initialState = (query: ParsedUrlQuery | null): EventPaginationState => {
  // TODO: check
  const initialType = (
    typeof query?.type === "string" ? query.type : "public"
  ) as EventType;

  const initialPage =
    typeof query?.page === "string" && !isNaN(parseInt(query.page, 10))
      ? parseInt(query.page, 10)
      : 1;

  return {
    eventType: initialType,
    page: initialPage,
    pageSize: 8,
  };
};

const eventPaginationReducer = (
  state: EventPaginationState,
  action: EventActions
): EventPaginationState => {
  switch (action.type) {
    case "SET_EVENT_TYPE":
      return { ...state, eventType: action.payload, page: 1 };
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
        type: state.eventType,
        page: state.page,
      },
    });
  }, [state]);

  const setEventType = useCallback((value: EventType) => {
    dispatch({ type: "SET_EVENT_TYPE", payload: value });
  }, []);

  const setPage = useCallback((value: number) => {
    dispatch({ type: "SET_PAGE", payload: value });
  }, []);

  return { ...state, setEventType, setPage };
};
