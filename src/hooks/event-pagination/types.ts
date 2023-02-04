import { EventType } from "../../types";

type PageAction = {
  type: "SET_PAGE";
  payload: number;
};

type EventAction = {
  type: "SET_EVENT_TYPE";
  payload: EventType;
};

type EventActions = PageAction | EventAction;

type EventPaginationState = {
  eventType: EventType;
  page: number;
  pageSize: number;
};

export type { EventActions, EventPaginationState };
