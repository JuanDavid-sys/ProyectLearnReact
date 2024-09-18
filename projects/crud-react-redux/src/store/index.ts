import userReducer, { rollbackUser } from "./users/slice"; // Importa el reducer userReducer y la acción rollbackUser del archivo del slice de usuarios. Esto permite manejar el estado relacionado con los usuarios y realizar una acción específica si es necesario revertir cambios.
//Este archivo es el corazón del manejo del estado global en aplicaciones que usan Redux. Aquí es donde se configura y crea el store de Redux, que es esencialmente un contenedor que mantiene todo el estado de tu aplicación
import { type Middleware, configureStore } from "@reduxjs/toolkit"; // Importa Middleware y configureStore desde Redux Toolkit. Middleware es un tipo que se usa para tipar los middleware de Redux, mientras que configureStore es una función que simplifica la configuración del store de Redux.
import { toast } from "sonner";

const persistanceLocalStorageMiddleware: Middleware = // Define un middleware para persistir el estado del store en el almacenamiento local del navegador cada vez que se realiza una acción. next(action); pasa la acción al siguiente middleware o reducer, y localStorage.setItem guarda el estado actualizado en el navegador.
	// Función del Middleware: Esta es una función de flecha anidada que define el middleware. Redux espera que el middleware sea una función que tome el objeto store, y devuelva otra función que toma next, y esa función a su vez debe retornar otra función que toma action.
	// Función del Middleware: Esta es una función de flecha anidada que define el middleware. Redux espera que el middleware sea una función que tome el objeto store, y devuelva otra función que toma next, y esa función a su vez debe retornar otra función que toma action.
		// Función del Middleware: Esta es una función de flecha anidada que define el middleware. Redux espera que el middleware sea una función que tome el objeto store, y devuelva otra función que toma next, y esa función a su vez debe retornar otra función que toma action.
		// Función del Middleware: Esta es una función de flecha anidada que define el middleware. Redux espera que el middleware sea una función que tome el objeto store, y devuelva otra función que toma next, y esa función a su vez debe retornar otra función que toma action.
		(store) =>
		(next) =>
		(action) => {
			next(action); // Esta llamada es crucial, pues permite que el ciclo de vida de la acción continúe hacia el próximo middleware o hacia los reducers. Si no se llama a next(action), la acción se detendría aquí, y no se propagaría a través del sistema Redux, impidiendo que el estado sea actualizado como se espera.
			localStorage.setItem(
				"__redux__state__", // __redux__state__" es la clave bajo la cual se guarda el estado en el localStorage. Esta clave puede ser cualquier cadena, pero debe ser única para evitar conflictos con otros datos almacenados en el mismo dominio.
				JSON.stringify(store.getState()),
			); // Después de que la acción ha sido procesada por otros middleware y reducers, se toma el estado actual del store y se guarda en el localStorage del navegador.
			// JSON.stringify(store.getState()) convierte el estado del store (que es un objeto JavaScript) en una cadena de texto JSON, ya que el localStorage solo puede almacenar strings.
		};

const syncWithDatabaseMiddleware: Middleware = // Este middleware sincroniza las acciones de eliminación de usuarios con un servidor remoto. Si la acción es deleteUserById, realiza una petición DELETE al servidor. Si falla, muestra un error y, si es posible, revierte el estado al estado anterior usando rollbackUser.
	(store) => (next) => (action) => {
		// store: El objeto store de Redux que contiene todo el estado de la aplicación y métodos como getState() para acceder al estado actual.
		// next: Una función que se llama para pasar la acción al siguiente middleware o al reducer si no hay más middleware.
		// action: La acción que fue despachada (por ejemplo, eliminar un usuario).
		const { type, payload } = action; // Desestructura la acción para obtener su tipo (type) y su contenido (payload). En este caso, el payload es el ID del usuario que será eliminado.
		const previousState = store.getState(); // Guarda el estado actual (antes de realizar cualquier cambio) para poder hacer algo con esta información más adelante si es necesario.
		next(action); // Esto es muy importante porque le dice a Redux: "Ok, esta acción puede continuar y llegar a los reducers." Si no se llamara a next, la acción se "detendría" aquí y no actualizaría el estado.

		if (type === "users/deleteUserById") {
			// Esta condición verifica si el tipo de acción es "deleteUserById". Si es así, ejecuta el código para sincronizar la eliminación del usuario con el servidor.
			const userIdToRemove = payload; // Guarda el ID del usuario que se va a eliminar

			const userToRemove = previousState.users.find(
				(user) => user.id === userIdToRemove,
			); // Busca en el estado anterior el usuario que coincide con el ID del usuario que se va a eliminar. Esto es útil si algo sale mal y necesitas revertir el estado.

			fetch(`https://jsonplaceholder.typicode.com/users/${userIdToRemove}`, {
				method: "DELETE",
			}) // Realiza una petición HTTP a la URL del servidor para eliminar el usuario. Utiliza el método DELETE, que es el estándar para eliminar recursos en servidores web.
				.then((res) => {
					//  Este bloque se ejecuta cuando la petición ha sido exitosa. Verifica si la respuesta (res.ok) es verdadera, lo que significa que el servidor confirmó la eliminación del usuario.
					if (res.ok) {
						toast.success(`Usuario ${payload} se ha eliminado correctamente`);
					} else {
						throw new Error("Error al eliminar al usuario");
					}
				})

				.catch((err) => {
					// Si la petición falla, el bloque .catch se ejecuta. Aquí es donde se maneja el error.
					toast.error(`Error deleting user ${userIdToRemove}`); // Muestra un mensaje de error en la interfaz de usuario indicando que hubo un problema al eliminar al usuario.
					if (userToRemove) store.dispatch(rollbackUser(userToRemove)); // Si algo salió mal, se despacha una acción rollbackUser para revertir el estado al estado anterior, devolviendo al usuario eliminado al estado.
					console.log("error");
					console.log(err);
				});
		}
	};

export const store = configureStore({
	// Es una función de Redux Toolkit que se utiliza para configurar y crear el store (almacén de estado) de tu aplicación Redux de manera simplificada.
	// Te permite registrar los reducers (que manejan el estado) y middleware (que se usan para añadir funcionalidades como guardar en localStorage o hacer peticiones HTTP).
	reducer: {
		// reducer: Aquí defines cómo se manejarán los diferentes tipos de estado dentro de la aplicación.
		users: userReducer, // users: userReducer: Esto significa que tienes un "slice" de estado llamado users, que es gestionado por el userReducer. Es como si dijeras: "Para cualquier cambio en los datos de los usuarios, usa este reducer para actualizar el estado".
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			persistanceLocalStorageMiddleware, // persistanceLocalStorageMiddleware: Guarda automáticamente el estado en el localStorage del navegador después de cada acción.
			syncWithDatabaseMiddleware, // syncWithDatabaseMiddleware: Sincroniza ciertas acciones (como eliminar usuarios) con una base de datos remota mediante una petición HTTP.
		), // concat(persistanceLocalStorageMiddleware, syncWithDatabaseMiddleware): Esta línea está agregando tus middleware personalizados al flujo:
});

export type RootState = ReturnType<typeof store.getState>;
// RootState: Aquí estamos creando una etiqueta especial para describir cómo se ve toda la información que guarda la aplicación (esto es el "estado"). Piensa en esto como decir: "Voy a definir cómo luce toda la hoja de papel donde tengo anotada la información de mi aplicación".
// ReturnType<typeof store.getState>: Esta parte le dice a TypeScript: "Quiero que observes cómo se ve todo el estado cuando llamo a store.getState() y quiero usar esa forma como un tipo". store.getState() es una función que le pregunta a la aplicación: "¿Cómo está tu estado ahora mismo?
// Lo que hace este código es decir: "Quiero que TypeScript conozca la forma del estado de mi aplicación, para que si accidentalmente trato de acceder a algo que no existe en esa hoja de papel, me avise"
export type AppDispatch = typeof store.dispatch;
// AppDispatch: Esto es como crear otra etiqueta para la herramienta que usa la aplicación para enviar órdenes o cambiar el estado. Piensa en esto como decir: "Esta es la herramienta oficial que voy a usar para enviar órdenes a mi aplicación".
// typeof store.dispatch: Aquí le decimos a TypeScript: "Quiero usar el mismo tipo de herramienta (dispatch) que ya tiene mi store". Esto asegura que cuando trates de enviar una orden, TypeScript sepa si lo estás haciendo bien o no.
// Supón que tienes una función en tu aplicación que dice: "Agregar un nuevo usuario" (como dispatch({ type: "ADD_USER", payload: "Carlos" })). Si intentas enviar una orden equivocada, como dispatch({ type: "FLY_TO_THE_MOON" }), TypeScript te dirá: "Eso no es una orden válida, no puedes volar a la luna desde esta aplicación". Esto es porque AppDispatch está asegurando que solo envíes órdenes correctas.
// RootState: Es como definir la forma de la hoja de papel donde guardas toda la información importante de tu aplicación. Sirve para que TypeScript pueda avisarte si tratas de acceder a algo que no existe en esa hoja.
// AppDispatch: Es como definir la herramienta oficial para enviar órdenes que cambian el estado de la aplicación. Sirve para que TypeScript pueda avisarte si tratas de enviar una orden incorrecta o inexistente.
