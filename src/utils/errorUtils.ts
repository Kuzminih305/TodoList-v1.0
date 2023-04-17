import {setAppErrorAC, setAppStatusAC} from "../reducers/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/api";

export const handleServerAppError = <D>(dispatch: Dispatch, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('some error'))
    }
    dispatch(setAppStatusAC('failed'))
}
export const handleServerNetWorkError = (dispatch: Dispatch, error: {message: string}) => {
    dispatch(setAppStatusAC('failed'))
    dispatch(setAppErrorAC(error.message))
}