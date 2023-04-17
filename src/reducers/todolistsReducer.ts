import {todolistsAPI, TodolistType} from "../api/api";
import {Dispatch} from "redux";
import {RequestStatusType, SetAppError, setAppErrorAC, SetAppStatus, setAppStatusAC} from "./appReducer";
import {handleServerAppError} from "../utils/errorUtils";



export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: TsarType):TodolistDomainType[] => {
    switch (action.type) {
        case "EDIT-TODO" : {
            return state.map(tl => tl.id === action.payload.todolistId
            ? { ...tl, title: action.payload.newTitle}
            : tl)
        }
        case "ADD-TODOLIST" : {
            return [{...action.payload.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        }
        case "REMOVE-TODOLIST" : {
            return state.filter(tl => tl.id !== action.payload.id)
        }
        case "CHANGE-FILTER" : {
            return state.map(tl => tl.id === action.payload.todolistId
            ? {...tl, filter: action.payload.value}
            : tl)
        }
        case "SET_TODOLIST" : {
          return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
        case "CHANGE_TODOLIST_ENTITY_STATUS" : {
            return state.map(tl => tl.id === action.payload.id
            ? {...tl, entityStatus: action.payload.status}
            : tl)
        }
        default:
            return state
    }
}



type TsarType = EditTodoACType
    | AddTodolist
    | RemoveTodolist
    | ChangeFilter
    | GetTodoLists
    | SetAppStatus
    | SetAppError
    | ChangeTodoListEntityStatus



type EditTodoACType = ReturnType<typeof changeTodoListTitleAC>
export type AddTodolist = ReturnType<typeof addTodolistAC>
export type RemoveTodolist = ReturnType<typeof removeTodolistAC>
type ChangeFilter = ReturnType<typeof changeFilterAC>
export type GetTodoLists = ReturnType<typeof getTodoListsAC>
export type ChangeTodoListEntityStatus = ReturnType<typeof changeTodoListEntityStatusAC>

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
export const changeTodoListEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {
        type: "CHANGE_TODOLIST_ENTITY_STATUS",
            payload: {
                id,
                status
            }
    }as const
}
//----------------------------THUNK--------------------------------------------

export const getTodoListTC = () => (dispatch: Dispatch<TsarType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodoLists()
        .then(res => {
            dispatch(getTodoListsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const deleteTodoListTC = (todolistId: string) => (dispatch:Dispatch<TsarType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListEntityStatusAC(todolistId, 'loading'))
    todolistsAPI.deleteTodoList(todolistId)
        .then( (res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('some error'))
                }
            }
        })
        .catch((e) => {
            dispatch(changeTodoListEntityStatusAC(todolistId, 'failed'))
            dispatch(setAppStatusAC('failed'))
            dispatch(setAppErrorAC(e.message))
        })
}
export const createTodoListTC = (title: string) => (dispatch: Dispatch<TsarType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodoList(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
}
export const updateTodoListTC = (todolistId: string, title: string) => (dispatch: Dispatch<TsarType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.updateTodoList(todolistId, title)
        .then( (res) => {
            dispatch(changeTodoListTitleAC(todolistId, title))
            dispatch(setAppStatusAC('succeeded'))
        })
}