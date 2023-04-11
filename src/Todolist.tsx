import React, {memo, useCallback, useEffect} from 'react';
import {SuperInput} from "./components/SuperInput";
import {EditableSpan} from "./components/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Task from "./components/Task";
import {TaskStatuses, TaskType} from "./api/api";
import {FilterValuesType} from "./reducers/todolistsReducer";
import {useAppDispatch} from "./state/store";
import {getTasksTC} from "./reducers/tasksReducer";




type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (todolistId: string ,taskId: string) => void
    changeFilter: (todolistId: string ,value: FilterValuesType) => void
    addTask: (todolistId: string ,title: string) => void
    changeTaskStatus: (todolistId: string ,taskId: string, status: TaskStatuses) => void
    filter: FilterValuesType
    removeTodolist: (id: string) => void
    editTask: (todolistId: string, taskId: string ,newTitle: string) => void
    editTodo: (todolistId: string, newTitle: string) => void
}

export const Todolist = memo((props: PropsType) => {
    
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getTasksTC(props.id))
    },[])

    const deleteTodolist = () => {
        props.removeTodolist(props.id)
    }

    const addTask = useCallback((title: string) => {
        props.addTask(props.id,title)
    },[props.addTask, props.id])

    const editTodoHandler = useCallback((newTitle: string) => {
        props.editTodo(props.id, newTitle)
    },[props.editTodo,props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter(props.id,"all"),[props.changeFilter,props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.id,"active"),[props.changeFilter,props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.id,"completed"),[props.changeFilter,props.id]);

    let tasksForTodolist = props.tasks

    if (props.filter === "active") {
        // tasksForTodolist = props.tasks.filter(t => !t.isDone);
    }
    if (props.filter === "completed") {
        // tasksForTodolist = props.tasks.filter(t => t.isDone);
    }

    // const removeTask = useCallback((taskId: string) => {
    //     props.removeTask(props.id,taskId)
    // },[props.removeTask,props.id])
    // const changeTaskStatus = useCallback((taskId: string, newIsDone: boolean) => {
    //     props.changeTaskStatus(props.id ,taskId, newIsDone);
    // },[props.changeTaskStatus,props.id])
    // const editTask = useCallback((taskId: string,newTitle:string) => {
    //     props.editTask(props.id, taskId, newTitle)
    // },[props.editTask,props.id])

    return <div>
        <h3>
        <EditableSpan oldTitle={props.title} callBack={editTodoHandler}/>
            <IconButton aria-label="delete"
                        onClick={deleteTodolist}>
                <DeleteIcon/>
            </IconButton>
        </h3>
            <SuperInput callBack={addTask}/>
        <ul>
            {
                tasksForTodolist.map(t => {
                    return (
                    <Task
                        key={t.id}
                        task={t}
                        todolistId={props.id}
                        changeTaskStatus={props.changeTaskStatus}
                        editTask={props.editTask}
                        removeTask={props.removeTask}
                    />
                    )
                })
            }
        </ul>
        <div>

            <Button variant = {props.filter === 'all' ? "outlined" : "contained"} style={{margin: "3px"}} onClick={onAllClickHandler}>All</Button>
            <Button variant = {props.filter === 'active' ? "outlined" : "contained"} style={{margin: "3px"}} onClick={onActiveClickHandler}>Active</Button>
            <Button variant = {props.filter === 'completed' ? "outlined" : "contained"} style={{margin: "3px"}} onClick={onCompletedClickHandler}>Completed</Button>

        </div>
    </div>
});
