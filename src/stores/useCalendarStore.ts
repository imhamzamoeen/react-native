import useApiFetch from "@/libs/useAxios";
import {getExceptionMessage} from "@/libs/useHelper";
import useToast from "@/libs/useToast";
import {create} from "zustand";

const useCalendarStore = create((set: any, get: any) => ({
  isFetching: false,
  include: [],
  events: [],
  calendars: {SURVEYS: 2},
  index: async () => {
    try {
      set({isFetching: true});

      const {data} = await useApiFetch(
        "/calendar-events?include=eventable.lead&all=true&filter[calendars]=" +
          get().calendars.SURVEYS
      );

      set({events: data.calender_events});
    } catch (e) {
      useToast().makeToast({
        type: "error",
        message: getExceptionMessage(e),
      });
    } finally {
      set({isFetching: false});
    }
  },
  reset: async () => {
    set({
      isFetching: false,
    });
  },
}));

export default useCalendarStore;
