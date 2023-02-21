import {TasksStateType} from "../App";
import {v1} from "uuid";



export const tasksReducer = (state: TasksStateType, action: TsarTasksType) => {
    switch (action.type) {
        case "NEW-TASKS-FOR-NEW-TODOLIST" : {
            return {...state, [action.payload.newTodoListId]: []}
        }
        case "EDIT-TASK" : {
            // const editVal = {...tasks,[todolistId]: tasks[todolistId].map(el => el.id === taskId ? {...el, title: newTitle} : el)}
            return {...state,[action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.taskId
                    ? {...el, title: action.payload.newTitle}
                    : el )}
        }
        case "REMOVE-TASK": {
            return {...state,[action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.id)}
        }
        case "ADD-TASK": {
            let newTask = {id: v1(), title: action.payload.title, isDone: false};
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }
        case "CHANGE-STATUS" : {
            return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(el => el.id === action.payload.taskId
                ? {...el, isDone: action.payload.isDone}
                : el )}
        }
        default:
            return state
    }
}

type TsarTasksType =
    newTasksForNewTodoListACType
    | editTaskACType
    | removeTask
    | addTask
    | changeStatus



type newTasksForNewTodoListACType = ReturnType<typeof newTasksForNewTodoListAC>
type editTaskACType = ReturnType<typeof editTaskAC>
type removeTask = ReturnType<typeof removeTaskAC>
type addTask = ReturnType<typeof addTaskAC>
type changeStatus = ReturnType<typeof changeStatusAC>

export const newTasksForNewTodoListAC = (newTodoListId: string) => {
    return {
        type: "NEW-TASKS-FOR-NEW-TODOLIST",
        payload: {
            newTodoListId
        }
    } as const
}
export const editTaskAC = (todolistId: string, taskId: string ,newTitle: string) => {
    return {
        type: "EDIT-TASK",
        payload: {
            todolistId,
            taskId,
            newTitle
        }
    } as const
}
export const removeTaskAC = (todolistId: string ,id: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {
            todolistId,
            id
        }
    } as const
}
export const addTaskAC = (todolistId: string,title: string) => {
    return {
        type: "ADD-TASK",
        payload: {
            todolistId,
            title
        }
    } as const
}
export const changeStatusAC = (todolistId: string,taskId: string, isDone: boolean) => {
    return {
        type: "CHANGE-STATUS",
        payload: {
            todolistId,
            taskId,
            isDone
        }
    } as const
}