import { useAppDispatch } from "../hooks/store"; // Importa el hook personalizado useAppDispatch para utilizarlo en acciones Redux.
import { UserId, addNewUser, deleteUserById } from "../store/users/slice"; // Importa tipos y acciones del slice de usuarios para poder utilizarlas aquí.
//UserId: Un tipo TypeScript que representa el tipo de dato para el ID de un usuario.
//addNewUser: Una acción de Redux creada en el slice de usuarios que se utiliza para agregar un nuevo usuario al estado.
//deleteUserById: Una acción de Redux para eliminar un usuario por su ID del estado.

export const useUserActions = () => {
	//Este hook encapsula la lógica necesaria para interactuar con el estado de Redux relacionado con operaciones de usuarios. Al ser un hook, puede ser reutilizado en varios componentes de React.
	const dispatch = useAppDispatch(); //Aquí se obtiene la función dispatch del hook useAppDispatch. Esta función se utiliza para despachar acciones a Redux. dispatch es esencialmente la manera en que envías acciones para modificar el estado global de la aplicación gestionado por Redux.

	const addUser = ({ name, email, github }) => {
		//Define una función addUser que acepta un objeto con tres propiedades: name, email, y github. Estas propiedades representan los datos de un usuario nuevo.
		dispatch(addNewUser({ name, email, github })); //Esta línea despacha una acción addNewUser al store de Redux, llevando como payload el objeto { name, email, github }. Esto activará el reducer asociado a addNewUser para actualizar el estado con el nuevo usuario.
	};

	const removeUser = (id: UserId) => {
		// Define una función removeUser que acepta un id de tipo UserId. Esta función se utilizará para eliminar un usuario del estado.
		dispatch(deleteUserById(id)); //Despacha la acción deleteUserById al store de Redux, con el id del usuario a eliminar como payload. Esto activará el reducer asociado para eliminar el usuario del estado.
	};

	return { addUser, removeUser };
};
