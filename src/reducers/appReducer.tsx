

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP-SET-STATUS':
            return {...state, status: action.payload.status}
        case 'APP-SET-ERROR' :
            return {...state, error: action.payload.value}
        default:
            return state
    }
}

type ActionsType = SetAppStatus | SetAppError

export type SetAppStatus = ReturnType<typeof setAppStatusAC>
export type SetAppError = ReturnType<typeof setAppErrorAC>

export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: "APP-SET-STATUS",
        payload: {
            status
        }
    }as const
}
export const setAppErrorAC = (value: string | null) => {
    return {
        type: 'APP-SET-ERROR',
            payload: {
                value
            }
    }as const
}
