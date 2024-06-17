export type Lead = {
  id: number;
  comments: object[];
  lead_additional: object;
  status_details: LeadStatus;
  survey_booking: SurveyBooking;
};

export type SurveyBooking = {
  preffered_time: string | null;
  survey_at: string;
  survey_to: string;
  created_at: string;
  created_by: {
    name: string;
  };
};

export type LeadStatus = {
  name: string;
  lead_status_model: {
    color: string;
  };
};

export type Filters = {
  name: string | "today" | "last_week" | "next_week";
};
