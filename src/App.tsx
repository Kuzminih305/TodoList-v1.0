import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';

import {SuperInput} from "./components/SuperInput";
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid, LinearProgress, Paper} from "@mui/material";
import {
    changeFilterAC, createTodoListTC, deleteTodoListTC,
    FilterValuesType, getTodoListTC,
    TodolistDomainType, updateTodoListTC,
} from "./reducers/todolistsReducer";
import {
    createTaskTC, deleteTaskTC,
    updateTaskTC,
} from "./reducers/tasksReducer";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./state/store";
import {TaskStatuses, TaskType} from "./api/api";
import {ErrorSnackbar} from "./components/ErrorSnackBar";



export type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {

    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const status = useSelector<AppRootStateType>(state => state.app.status)
    const dispatch = useAppDispatch()


    useEffect( () => {
        dispatch(getTodoListTC())
    },[dispatch])


    const editTask = useCallback((todolistId: string, taskId: string ,newTitle: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {title: newTitle}))
    },[dispatch])

    const editTodo = useCallback((todolistId: string, newTitle: string) => {
        dispatch(updateTodoListTC(todolistId, newTitle))
    },[dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(deleteTodoListTC(id))
    },[dispatch])

    const removeTask = useCallback((todolistId: string ,id: string) => {
        dispatch(deleteTaskTC(todolistId,id))
    }, [dispatch])

    const addTask = useCallback((todolistId: string,title: string) => {
        dispatch(createTaskTC(todolistId,title))
    },[dispatch])

    const changeStatus = useCallback((todolistId: string,taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistId,taskId, {status}))
    }, [dispatch])

    const changeFilter = useCallback((todolistId: string ,value: FilterValuesType) => {
        dispatch(changeFilterAC(todolistId, value))
    },[])

    const addTodolist = useCallback((title: string) => {
        const action = createTodoListTC(title)
        dispatch(action)
    },[dispatch])


    return (
        <div className="App">
           <ErrorSnackbar/>
            <ButtonAppBar/>
            {status === 'loading' && <LinearProgress color="secondary" />}
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
                                    entityStatus={el.entityStatus}
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
