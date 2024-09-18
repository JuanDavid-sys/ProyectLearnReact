import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { useUserActions } from "../hooks/useUserActions";

export function CreateNewUser() {
	const { addUser } = useUserActions(); //Utiliza el hook useUserActions para obtener la función addUser. Esta función se usará para agregar un usuario al estado de Redux.
	const [result, setResult] = useState<"ok" | "ko" | null>(null); //Inicializa un estado local llamado result con useState. El estado result puede tener tres valores: "ok", "ko", o null, lo cual indica el resultado de intentar agregar un usuario.

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		// Define una función handleSubmit que se invocará cuando el formulario sea enviado. El tipo React.FormEvent<HTMLFormElement> asegura que el evento recibido sea de un formulario.
		event.preventDefault();

		setResult(null); // Resetea el estado result a null al comenzar el procesamiento del formulario para asegurar que mensajes anteriores no se muestren.

		const form = event.target; // Obtiene el formulario que desencadenó el evento submit.
		const formData = new FormData(form); //Crea un objeto FormData a partir del formulario, lo cual facilita la extracción de los valores de los campos del formulario.

		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const github = formData.get("github") as string;

		if (!name || !email || !github) {
			return setResult("ko"); // Si algún campo está vacío, establece el estado result a "ko" indicando un error en la entrada del formulario.
		} //Verifica si alguno de los campos está vacío. Si alguno lo está, no procede con agregar el usuario.

		addUser({ name, email, github }); // Si todos los campos están completos, llama a addUser con el objeto del usuario a agregar.
		setResult("ok"); // Establece el estado result a "ok" indicando que el usuario fue agregado exitosamente.
		form.reset(); // Resetea el formulario a su estado inicial, limpiando los campos para un nuevo ingreso.
	};

	return (
		<Card style={{ marginTop: "16px" }}>
			<Title>Create New User</Title>

			<form onSubmit={handleSubmit} className="FormNewUser">
				<TextInput name="name" placeholder="Aqui el nombre"></TextInput>
				<TextInput name="email" placeholder="Aqui el email"></TextInput>
				<TextInput
					name="github"
					placeholder="Aqui el usuario de GitHub"
				></TextInput>

				<div>
					<Button
						type="submit"
						style={{
							marginTop: "16px",
							borderRadius: "5px",
							padding: "4px",
							background: "rgb(0, 123, 255)",
							color: "white",
						}}
					>
						Crear Usuario
					</Button>
					<span>
						{result === "ok" && (
							<Badge color="green">Guardado correctamente</Badge>
						)}
						{result === "ko" && <Badge color="red">Error en los campos</Badge>}
					</span>
				</div>
			</form>
		</Card>
	);
}
