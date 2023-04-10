import React, {useCallback} from 'react';
import './App.css';
import {Todolist} from './Todolist';

import {SuperInput} from "./components/SuperInput";
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodolistAC,
    changeFilterAC,
    editTodoAC,
    removeTodolistAC,
} from "./reducers/todolistsReducer";
import {
    addTaskAC,
    changeStatusAC,
    editTaskAC,
    removeTaskAC,
} from "./reducers/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodolistsType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {

    const todoLists = useSelector<AppRootStateType, Array<TodolistsType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const editTask = useCallback((todolistId: string, taskId: string ,newTitle: string) => {
        dispatch(editTaskAC(todolistId, taskId, newTitle))
    },[dispatch])

    const editTodo = useCallback((todolistId: string, newTitle: string) => {
        dispatch(editTodoAC(todolistId, newTitle))
    },[dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistAC(id))
    },[dispatch])

    const removeTask = useCallback((todolistId: string ,id: string) => {
        dispatch(removeTaskAC(todolistId,id))
    }, [dispatch])

    const addTask = useCallback((todolistId: string,title: string) => {
        dispatch(addTaskAC(todolistId, title))
    },[dispatch])

    const changeStatus = useCallback((todolistId: string,taskId: string, isDone: boolean) => {
        dispatch(changeStatusAC(todolistId,taskId,isDone))
    }, [dispatch])

    const changeFilter = useCallback((todolistId: string ,value: FilterValuesType) => {
        dispatch(changeFilterAC(todolistId, value))
    },[dispatch])

    const addTodolist = useCallback((title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
    },[dispatch])


    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: "10px", justifyContent: "center"}}>
                    <SuperInput callBack={addTodolist}/>
                </Grid>
                <Grid container spacing={3} style={{justifyContent: "center"}}>
                    {todoLists.map(el => {

                        let allTasksForTodolist = tasks[el.id];

                        return (
                            <Grid item>
                                <Paper style={{padding: "10px"}}>
                                <Todolist
                                    key={el.id}
                                    id={el.id}
                                    title={el.title}
                                    tasks={allTasksForTodolist}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={el.filter}
                                    removeTodolist={removeTodolist}
                                    editTask={editTask}
                                    editTodo={editTodo}
                                />
                                </Paper>
                            </Grid>
                        )
                    })
                    }
                </Grid>
            </Container>

        </div>
    );
}

export default App;
