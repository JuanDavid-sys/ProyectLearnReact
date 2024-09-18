import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
//AppDispatch: Es un tipo que representa el tipo de las funciones de dispatch en tu aplicación.
//RootState: Es un tipo que representa el estado global de tu aplicación
//TypedUseSelectorHook: Es un tipo que permite definir un hook useSelector que será específico para el estado de tu aplicación.
//useDispatch: Es un hook de Redux que te permite despachar acciones.
//useSelector: Es un hook que permite acceder a cualquier parte del estado almacenado en Redux.

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; //Crea un useSelector específico para tu aplicación que siempre espera el tipo de estado global RootState.
export const useAppDispatch: () => AppDispatch = useDispatch; //Crea un hook personalizado que devuelve tu función de dispatch específica, asegurando que se use el tipo correcto en todo tu código.
