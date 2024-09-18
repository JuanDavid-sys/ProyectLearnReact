import { type PayloadAction, createSlice } from "@reduxjs/toolkit"; //createSlice: Es una función de Redux Toolkit que simplifica la creación de "slices" de estado. Un slice incluye el estado inicial, los reducers y las acciones asociadas.   ayloadAction: Es un tipo genérico proporcionado por Redux Toolkit que ayuda a tipar las acciones que contienen un "payload" (los datos que acompañan una acción).
// PayloadAction: Un tipo que ayuda a definir acciones con un payload (datos que pasas con la acción).
// createSlice: Función que simplifica la creación de un slice de estado, incluyendo reducers y las acciones necesarias.
const DEFAULT_STATE = [
	// Define una lista de usuarios por defecto. Este array se utiliza como estado inicial si no hay datos persistidos en localStorage
	{
		id: "1",
		name: "Peter Doe",
		email: "Pete@gmail.com",
		github: "RisingFisan",
	},
	{
		id: "2",
		name: "Juan Duarte",
		email: "Juanito@gmail.com",
		github: "juanDavid-sys",
	},
	{
		id: "3",
		name: "Miguel",
		email: "Miguelito@gmail.com",
		github: "midudev",
	},
	{
		id: "4",
		name: "Dieguito",
		email: "Alonso@gmail.com",
		github: "diegoug",
	},
];

export type UserId = string; //Define un tipo personalizado para el ID de los usuarios, que en este caso es un string.

export interface User {
	//Define una interfaz para un usuario, especificando los campos que debe tener.
	name: string;
	email: string;
	github: string;
}

export interface UserWithId extends User {
	//Extiende la interfaz User añadiendo un id, específico para los usuarios con ID.
	id: UserId;
}

const initialState: UserWithId[] = (() => {
	// Define el estado inicial del slice intentando recuperar un estado persistido de localStorage, si no existe, usa DEFAULT_STATE.
	// initialState: Este es el estado inicial que se utilizará en el slice. Se obtiene de localStorage si los datos han sido guardados previamente, o se usa el DEFAULT_STATE si no se encuentran datos persistidos.
	const persistedState = localStorage.getItem("__redux__state__"); //localStorage.getItem("__redux__state__"): Intenta recuperar los datos de estado almacenados en localStorage. Esto es útil para que los usuarios no pierdan los datos de los usuarios al recargar la página.
	if (persistedState) return JSON.parse(persistedState).users;
	return DEFAULT_STATE;
})();

export const usersSlice = createSlice({
	//Define el slice de usuarios, incluyendo el estado inicial y los reducers para manejar las acciones addNewUser, deleteUserById, y rollbackUser.
	name: "users",
	initialState,
	reducers: {
		addNewUser: (state, action: PayloadAction<User>) => {
			const id = crypto.randomUUID();
			state.push({ id, ...action.payload });
		},
		deleteUserById: (state, action: PayloadAction<UserId>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		rollbackUser: (state, action: PayloadAction<UserWithId>) => {
			const isUserAlreadyDefined = state.some(
				(user) => user.id === action.payload.id,
			);
			if (!isUserAlreadyDefined) {
				state.push(action.payload);
			}
		},
	},
});

export default usersSlice.reducer;

export const { addNewUser, deleteUserById, rollbackUser } = usersSlice.actions;
