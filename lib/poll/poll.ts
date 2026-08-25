export type Poll = {
  id: string;
  question: string;
  optionIds: string[];
  userId: string;
};

export const createPoll = (question: string, userId: string) => {
  const poll: Poll = { id: "-1", question, optionIds: [], userId };

  // insert to db
  return poll;
};

export const getPoll = (id: string) => {
  // get from db

  const poll: Poll = { id: "id", question: "", optionIds: [], userId: "" };
  return poll;
};

export const deletePoll = (id: string) => {
  return id;
};
