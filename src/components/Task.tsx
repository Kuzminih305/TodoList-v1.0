import React, {ChangeEvent, memo} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "../App";

type TaskPropsType = {
    task: TaskType
    changeTaskStatus: (taskId: string, isDone: boolean) => void
    editTask: (taskId: string ,newTitle: string) => void
    removeTask: (taskId: string) => void
}

const Task = memo(({
                  task,
                  changeTaskStatus,
                  editTask,
                  removeTask

                    }:TaskPropsType) => {


    const onClickHandler = () => removeTask(task.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked);
    }
    const editTaskHandler = (newTitle:string) => {
        editTask(task.id, newTitle)
    }

    return (
        <div className={task.isDone ? "is-done" : ""}>
            <Checkbox
                onChange={onChangeHandler}
                checked={task.isDone}
            />
            <EditableSpan oldTitle={task.title} callBack={editTaskHandler}/>
            <IconButton aria-label="delete"
                        onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </div>
    );
});

export default Task;