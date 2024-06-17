import useApiFetch from "@/libs/useAxios";
import {getExceptionMessage} from "@/libs/useHelper";
import useToast from "@/libs/useToast";
import {create} from "zustand";

const useLeadStore = create((set: any, get: any) => ({
  isFetching: false,
  isFetchingMore: true,
  include: [
    "leadAdditional",
    "mobileAssetSyncs",
    "leadGenerator",
    "surveyBooking.createdBy",
    "benefits",
    "comments.commentator",
  ],
  filters: {} as any,
  leads: [],
  meta: {
    to: 50,
    total: 50,
    per_page: 50,
    links: [],
  },
  selectedLead: null as any,
  fetchLeads: async (queryString = "") => {
    try {
      set({isFetching: true});

      const {data, meta} = await useApiFetch(
        `/leads?include=surveyBooking&per_page=${get().meta.per_page}${
          queryString !== "" ? `&${queryString}` : ""
        }`
      );

      set({meta});

      const sortedLeads = data.leads.sort((a: any, b: any) => {
        const hasSurveyAtA =
          a?.survey_booking && a.survey_booking.hasOwnProperty("survey_at");
        const hasSurveyAtB =
          b?.survey_booking && b.survey_booking.hasOwnProperty("survey_at");

        if (hasSurveyAtA && hasSurveyAtB) {
          return (
            // @ts-ignore
            new Date(b.survey_booking.survey_at) -
            // @ts-ignore
            new Date(a.survey_booking.survey_at)
          );
        } else if (hasSurveyAtA && !hasSurveyAtB) {
          return -1;
        } else if (!hasSurveyAtA && hasSurveyAtB) {
          return 1;
        } else {
          return b.id - a.id;
        }
      });

      set({leads: sortedLeads});

      if (data.leads.length === 0) {
        useToast().makeToast({
          type: "info",
          message: "No leads found.",
        });
      }
    } catch (e) {
      useToast().makeToast({
        type: "error",
        message: getExceptionMessage(e),
      });
    } finally {
      set({isFetching: false});
    }
  },
  fetchLead: async (id: number | string) => {
    try {
      set({isFetching: true});
      const {data} = await useApiFetch(
        `/leads/${id}?include=${get().include.join(",")}`
      );
      set({selectedLead: data.lead});
      return data;
    } catch (e) {
      useToast().makeToast({
        type: "error",
        message: getExceptionMessage(e),
      });
    } finally {
      set({isFetching: false});
    }
  },
  storeAssetSync: async (id: number | string, assetId: string) => {
    try {
      set({isFetching: true});
      const {data} = await useApiFetch(`/leads/${id}/mobile-asset/${assetId}`);
      set({selectedLead: data});
    } catch (e: any) {
      useToast().makeToast({
        type: "error",
        message: getExceptionMessage(e),
      });
    } finally {
      set({isFetching: false});
    }
  },
  storeComments: async (id: number | string, comments: string) => {
    try {
      await useApiFetch(`/leads/${id}/comments`, {
        method: "POST",
        data: {comments},
      });
    } catch (e: any) {
      useToast().makeToast({
        type: "error",
        message: getExceptionMessage(e),
      });
    } finally {
      //
    }
  },
  fetchMore: async () => {
    try {
      set({isFetchingMore: true});

      const array = get().meta.links;
      const lastIndex = array.length - 1;
      const lastElement = array[lastIndex];

      if (lastElement && lastElement.url !== null) {
        const queryParams = lastElement.url.split("?")[1];

        const {data, meta} = await useApiFetch(
          `/leads?${queryParams}&per_page=${get().meta.per_page}`
        );

        set((prev: any) => {
          const updatedLeads = [...prev.leads, ...data.leads] as any[];
          updatedLeads.sort((a, b) => b.id - a.id);

          return {...prev, leads: updatedLeads};
        });

        set({meta});
      } else if (get().meta.total === 0) {
        useToast().makeToast({
          type: "error",
          message: "No more leads available.",
        });
      }
    } catch (e: any) {
      useToast().makeToast({
        type: "error",
        message: getExceptionMessage(e),
      });
    } finally {
      set({isFetchingMore: false});
    }
  },
  reset: async () => {
    set({
      isFetching: false,
      isFetchingMore: true,
      selectedLead: null as any,
    });
  },
}));

export default useLeadStore;
