import {TasksStateType} from "../App";
import {
    AddTodolist,
    ChangeTodoListEntityStatus,
    changeTodoListEntityStatusAC,
    GetTodoLists,
    RemoveTodolist
} from "./todolistsReducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../state/store";
import {SetAppError, setAppErrorAC, SetAppStatus, setAppStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetWorkError} from "../utils/errorUtils";
import {AxiosError} from "axios";



const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TsarTasksType):TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {...state,[action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.id)}
        }
        case "ADD-TASK": {
            return {...state,[action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]}
        }
        case "UPDATE_TASK" : {
            return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.taskId
                ? {...el, ...action.payload.model}
                : el )}
        }
        case "ADD-TODOLIST" : {
            return {...state,[action.payload.todolist.id]: []}
        }
        case "REMOVE-TODOLIST" : {
            const copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        }
        case "SET_TODOLIST" : {
            const stateCopy = {...state}
            action.payload.todoLists.forEach((tl) => {stateCopy[tl.id] = []})
            return stateCopy
        }
        case "SET_TASKS" : {
            return {...state, [action.payload.todoListId]:
                    [...action.payload.tasks]}
        }
        default:
            return state
    }
}

type TsarTasksType =
    | RemoveTask
    | AddTask
    | ChangeStatus
    | AddTodolist
    | RemoveTodolist
    | GetTodoLists
    | SetTasks
    | SetAppStatus
    | SetAppError
    | ChangeTodoListEntityStatus




type RemoveTask = ReturnType<typeof removeTaskAC>
type AddTask = ReturnType<typeof addTaskAC>
type ChangeStatus = ReturnType<typeof updateTaskAC>
type SetTasks = ReturnType<typeof setTasksAC>


export const removeTaskAC = (todolistId: string ,id: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {
            todolistId,
            id
        }
    } as const
}
export const addTaskAC = (task: TaskType) => {
    return {
        type: "ADD-TASK",
        payload: {
            task
        }
    } as const
}
export const updateTaskAC = (todolistId: string,taskId: string, model: UpdateDomainTaskModelType) => {
    return {
        type: "UPDATE_TASK",
        payload: {
            todolistId,
            taskId,
            model
        }
    } as const
}
export const setTasksAC = (tasks: TaskType[],todoListId: string) => {
    return {
        type: "SET_TASKS",
        payload: {
            tasks,
            todoListId
        }
    } as const
}
//----------------------THUNK--------------------------------------


export const getTasksTC = (todoListId: string) => (dispatch: Dispatch<TsarTasksType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTasks(todoListId)
        .then( (res) => {
            dispatch(setTasksAC(res.data.items, todoListId))
            dispatch(setAppStatusAC('succeeded'))
        })

}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<TsarTasksType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then( (res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(todolistId, taskId))
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
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<TsarTasksType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then( (res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch( (e: AxiosError) => {
            handleServerNetWorkError(dispatch, e)
        })
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (todolistId: string,taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch<TsarTasksType>, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)

    if (task) {
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
                ...domainModel
        }
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then( (res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(todolistId, taskId, domainModel))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(dispatch,res.data)
                }
            })
            .catch( (e) => {
                handleServerNetWorkError(dispatch, e)
            })
    }
}