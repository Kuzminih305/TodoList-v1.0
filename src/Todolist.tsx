import React, {ChangeEvent} from 'react';
import {FilterValuesType, TaskType} from './App';
import {SuperInput} from "./components/SuperInput";
import {EditableSpan} from "./components/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';




type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (todolistId: string ,taskId: string) => void
    changeFilter: (todolistId: string ,value: FilterValuesType) => void
    addTask: (todolistId: string ,title: string) => void
    changeTaskStatus: (todolistId: string ,taskId: string, isDone: boolean) => void
    filter: FilterValuesType
    removeTodolist: (id: string) => void
    editTask: (todolistId: string, taskId: string ,newTask: string) => void
    editTodo: (todolistId: string, newTitle: string) => void
}

export function Todolist(props: PropsType) {

    const deleteTodolist = () => {
        props.removeTodolist(props.id)
    }

    const addTask = (title: string) => {
        props.addTask(props.id,title)
    }
    const editTodoHandler = (newTitle: string) => {
        props.editTodo(props.id, newTitle)
    }

    const onAllClickHandler = () => props.changeFilter(props.id,"all");
    const onActiveClickHandler = () => props.changeFilter(props.id,"active");
    const onCompletedClickHandler = () => props.changeFilter(props.id,"completed");


    return <div>
        <h3>
        <EditableSpan oldTitle={props.title} callBack={editTodoHandler}/>
        {/*<button onClick={deleteTodolist}>x</button>*/}
            <IconButton aria-label="delete"
                        onClick={deleteTodolist}>
                <DeleteIcon/>
            </IconButton>
        </h3>
            <SuperInput callBack={addTask}/>
        <ul>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(props.id,t.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(props.id ,t.id, e.currentTarget.checked);
                    }
                    const editTaskHandler = (newTitle:string) => {
                        props.editTask(props.id, t.id, newTitle)
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                                    onChange={onChangeHandler}
                                    checked={t.isDone}
                        />


                        {/*<input type="checkbox"*/}
                        {/*       onChange={onChangeHandler}*/}
                        {/*       checked={t.isDone}/>*/}


                        <EditableSpan oldTitle={t.title} callBack={editTaskHandler}/>


                        {/*<button onClick={onClickHandler}>x</button>*/}


                        <IconButton aria-label="delete"
                                    onClick={onClickHandler}>
                            <DeleteIcon/>
                        </IconButton>

                    </li>
                })
            }
        </ul>
        <div>

            <Button variant = {props.filter === 'all' ? "outlined" : "contained"} style={{margin: "3px"}} onClick={onAllClickHandler}>All</Button>
            <Button variant = {props.filter === 'active' ? "outlined" : "contained"} style={{margin: "3px"}} onClick={onActiveClickHandler}>Active</Button>
            <Button variant = {props.filter === 'completed' ? "outlined" : "contained"} style={{margin: "3px"}} onClick={onCompletedClickHandler}>Completed</Button>



            {/*<button className={props.filter === 'all' ? "active-filter" : ""}*/}
            {/*        onClick={onAllClickHandler}>All</button>*/}
            {/*<button className={props.filter === 'active' ? "active-filter" : ""}*/}
            {/*    onClick={onActiveClickHandler}>Active</button>*/}
            {/*<button className={props.filter === 'completed' ? "active-filter" : ""}*/}
            {/*    onClick={onCompletedClickHandler}>Completed</button>*/}
        </div>
    </div>
}
