import {todolistsAPI, TodolistType} from "../api/api";
import {Dispatch} from "redux";



export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: TsarType):TodolistDomainType[] => {
    switch (action.type) {
        case "EDIT-TODO" : {
            const todolist = state.find(tl => tl.id === action.payload.todolistId)
            if (todolist) {
                todolist.title = action.payload.newTitle
            }
            return [...state]
        }
        case "ADD-TODOLIST" : {
            // const newTodoList: TodolistDomainType = {...action.payload.todolist, filter: 'all'}
            // return [newTodoList, ...state]
            return [{...action.payload.todolist, filter: 'all'}, ...state]
        }
        case "REMOVE-TODOLIST" : {
            return state.filter(tl => tl.id !== action.payload.id)
        }
        case "CHANGE-FILTER" : {
            return []
        }
        case "SET_TODOLIST" : {
          return action.payload.todoLists.map(tl => ({...tl, filter: 'all'}))
        }
        default:
            return state
    }
}



type TsarType = EditTodoACType | AddTodolist | RemoveTodolist | ChangeFilter | GetTodoLists



type EditTodoACType = ReturnType<typeof changeTodoListTitleAC>
export type AddTodolist = ReturnType<typeof addTodolistAC>
export type RemoveTodolist = ReturnType<typeof removeTodolistAC>
type ChangeFilter = ReturnType<typeof changeFilterAC>
export type GetTodoLists = ReturnType<typeof getTodoListsAC>

export const changeTodoListTitleAC = (todolistId: string, newTitle: string) => {
    return {
        type: "EDIT-TODO",
        payload: {
            todolistId,
            newTitle,
        }
    }as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {
        type: "ADD-TODOLIST",
        payload: {
            todolist
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
export const getTodoListsAC = (todoLists: TodolistType[]) => {
    return {
        type: "SET_TODOLIST",
        payload: {
            todoLists
        }
    }as const
}
//----------------------------THUNK--------------------------------------------

export const getTodoListTC = () => (dispatch: Dispatch) => {
    todolistsAPI.getTodoLists()
        .then(res => {
            dispatch(getTodoListsAC(res.data))
        })
}
export const deleteTodoListTC = (todolistId: string) => (dispatch:Dispatch) => {
    todolistsAPI.deleteTodoList(todolistId)
        .then( (res) => {
            dispatch(removeTodolistAC(todolistId))
        })
}
export const createTodoListTC = (title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTodoList(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item) )
        })
}
export const updateTodoListTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.updateTodoList(todolistId, title)
        .then( (res) => {
            dispatch(changeTodoListTitleAC(todolistId, title))
        })
}