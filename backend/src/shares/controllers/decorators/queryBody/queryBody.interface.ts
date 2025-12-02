export interface IQueryBody {
	sort: {
		field: number;
	},
	populate: string[];
}

export interface IQueryBodyAllowField {
	sort: string[],
	populate: string[];
}