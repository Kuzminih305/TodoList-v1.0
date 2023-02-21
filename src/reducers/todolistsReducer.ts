import {FilterValuesType, TodolistsType} from "../App";

export const todolistsReducer = (state: TodolistsType[], action: TsarType):TodolistsType[] => {
    switch (action.type) {
        case "EDIT-TODO" : {
            return state.map(el => el.id === action.payload.todolistId ? {...el, title: action.payload.newTitle}: el)
        }
        case "ADD-TODOLIST" : {
            let newTodoList: TodolistsType =
                {id: action.payload.newTodoListId, title: action.payload.title, filter: 'all'}
            return [newTodoList, ...state]
        }
        case "REMOVE-TODOLIST" : {
            return state.filter(el => el.id !== action.payload.id)
        }
        case "CHANGE-FILTER" : {
            return state.map(el => el.id === action.payload.todolistId
            ? {...el, filter: action.payload.value}
            : el)
        }
        default:
            return state
    }
}

type TsarType = editTodoACType | addTodolist | removeTodolist | changeFilter



type editTodoACType = ReturnType<typeof editTodoAC>
type addTodolist = ReturnType<typeof addTodolistAC>
type removeTodolist = ReturnType<typeof removeTodolistAC>
type changeFilter = ReturnType<typeof changeFilterAC>

export const editTodoAC = (todolistId: string, newTitle: string) => {
    return {
        type: "EDIT-TODO",
        payload: {
            todolistId,
            newTitle,
        }
    }as const
}
export const addTodolistAC = (title: string, newTodoListId: string) => {
    return {
        type: "ADD-TODOLIST",
        payload: {
            title,
            newTodoListId
        }
    }as const
}
export const removeTodolistAC = (id: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {
            id
        }
    }as const
}
export const changeFilterAC = (todolistId: string ,value: FilterValuesType) => {
    return {
        type: "CHANGE-FILTER",
        payload: {
            todolistId,
            value
        }
    }as const
}