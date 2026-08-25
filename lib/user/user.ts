export type User = {
	id: string;
	email: string;
	pollIds: string[];
	createdAt: Date;
};

export const createUser = (email: string) => {
	const createdAt = new Date(Date.now());

	const user: User = {
		id: "auto",
		email,
		pollIds: [],
		createdAt,
	};
};

export const getUser = (id: string) => {
	// get user from db
	const user: User = {
		id: "auto",
		email: "",
		pollIds: [],
		createdAt: new Date(),
	};
};
