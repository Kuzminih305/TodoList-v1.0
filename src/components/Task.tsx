import React, {ChangeEvent, memo, useCallback} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskStatuses, TaskType} from "../api/api";


type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (todolistId: string ,taskId: string, status: TaskStatuses) => void
    editTask: (todolistId: string, taskId: string, newTitle: string) => void
    removeTask: (todolistId: string ,taskId: string) => void
    disabled: boolean
}

const Task = memo(({
                       task,
                       todolistId,
                       changeTaskStatus,
                       editTask,
                       removeTask,
                       disabled

                   }: TaskPropsType) => {


    const onClickHandler = useCallback(() => removeTask(todolistId, task.id),[])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        changeTaskStatus(todolistId,task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New);
    },[])

    const editTaskHandler = useCallback((newTitle:string) => {
        editTask(todolistId,task.id, newTitle)
    },[])

    return (
        <div className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
            <Checkbox
                onChange={onChangeHandler}
                checked={task.status === TaskStatuses.Completed}
                disabled={disabled}
            />
            <EditableSpan oldTitle={task.title} callBack={editTaskHandler}/>
            <IconButton aria-label="delete"
                        onClick={onClickHandler}
                        disabled={disabled}>
                <DeleteIcon/>
            </IconButton>
        </div>
    );
});

export default Task;