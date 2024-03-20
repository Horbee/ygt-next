import { EventFilterType } from "../../types";

type PageAction = {
  type: "SET_PAGE";
  payload: number;
};

type EventAction = {
  type: "SET_EVENT_FILTER";
  payload: EventFilterType[];
};

type EventActions = PageAction | EventAction;

type EventPaginationState = {
  selectedFilter: EventFilterType[];
  page: number;
  pageSize: number;
};

export type { EventActions, EventPaginationState };
