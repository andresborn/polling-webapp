export type Option = {
  id: string;
  label: string;
  votes: number;
  pollId: string;
};

export const getOption = (id: string) => {
  // get from db
  const option: Option = {
    id: "id",
    label: "label",
    votes: 0,
    pollId: "pollId",
  };

  return option;
};

export const createOption = (id: string, label: string, pollId: string) => {
  const option = { id, label, votes: 0, pollId };

  // insert to db
  return option;
};

export const deleteOption = (id: string) => {
  // delete from db
  return id;
};
