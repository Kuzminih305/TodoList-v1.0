import React from 'react';
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
    // let [tasks, setTasks] = useState([
    //     {id: v1(), title: "HTML&CSS", isDone: true},
    //     {id: v1(), title: "JS", isDone: true},
    //     {id: v1(), title: "ReactJS", isDone: false},
    //     {id: v1(), title: "Rest API", isDone: false},
    //     {id: v1(), title: "GraphQL", isDone: false},
    // ]);
    // let [filter, setFilter] = useState<FilterValuesType>("all");
    // let [todolists, setTodolists] = useState<Array<TodolistsType>>([
    //     {id: todolistID1, title: 'What to learn', filter: 'all'},
    //     {id: todolistID2, title: 'What to buy', filter: 'all'},
    // ])
    // let [tasks, setTasks] = useState<TasksStateType>({
    //     [todolistID1]: [
    //         {id: v1(), title: "HTML&CSS", isDone: true},
    //         {id: v1(), title: "JS", isDone: true},
    //         {id: v1(), title: "ReactJS", isDone: false},
    //         {id: v1(), title: "Rest API", isDone: false},
    //         {id: v1(), title: "GraphQL", isDone: false},
    //     ],
    //     [todolistID2]: [
    //         {id: v1(), title: "HTML&CSS2", isDone: true},
    //         {id: v1(), title: "JS2", isDone: true},
    //         {id: v1(), title: "ReactJS2", isDone: false},
    //         {id: v1(), title: "Rest API2", isDone: false},
    //         {id: v1(), title: "GraphQL2", isDone: false},
    //     ]
    // });

    // let todolistID1 = v1();
    // let todolistID2 = v1();
    //
    // const [todolists, todolistsDispatch] = useReducer(todolistsReducer, [
    //     {id: todolistID1, title: 'What to learn', filter: 'all'},
    //     {id: todolistID2, title: 'What to buy', filter: 'all'},
    // ])
    //
    // const [tasks, tasksDispatch] = useReducer(tasksReducer, {
    //         [todolistID1]: [
    //             {id: v1(), title: "HTML&CSS", isDone: true},
    //             {id: v1(), title: "JS", isDone: true},
    //             {id: v1(), title: "ReactJS", isDone: false},
    //             {id: v1(), title: "Rest API", isDone: false},
    //             {id: v1(), title: "GraphQL", isDone: false},
    //         ],
    //         [todolistID2]: [
    //             {id: v1(), title: "HTML&CSS2", isDone: true},
    //             {id: v1(), title: "JS2", isDone: true},
    //             {id: v1(), title: "ReactJS2", isDone: false},
    //             {id: v1(), title: "Rest API2", isDone: false},
    //             {id: v1(), title: "GraphQL2", isDone: false},
    //         ]
    // });

    const todoLists = useSelector<AppRootStateType, Array<TodolistsType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()

    const editTask = (todolistId: string, taskId: string ,newTitle: string) => {
        dispatch(editTaskAC(todolistId, taskId, newTitle))

    }
    const editTodo = (todolistId: string, newTitle: string) => {
        dispatch(editTodoAC(todolistId, newTitle))

    }

    function removeTodolist(id: string) {
        dispatch(removeTodolistAC(id))
    }

    function removeTask(todolistId: string ,id: string) {
        dispatch(removeTaskAC(todolistId,id))

    }

    function addTask(todolistId: string,title: string) {
        dispatch(addTaskAC(todolistId, title))

    }

    function changeStatus(todolistId: string,taskId: string, isDone: boolean) {
        dispatch(changeStatusAC(todolistId,taskId,isDone))

    }




    function changeFilter(todolistId: string ,value: FilterValuesType) {
        dispatch(changeFilterAC(todolistId, value))

    }

    function addTodolist(title: string) {
        const action = addTodolistAC(title)
        dispatch(action)
    }


    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: "10px", justifyContent: "center"}}>
                    <SuperInput callBack={addTodolist}/>
                </Grid>
                <Grid container spacing={3} style={{justifyContent: "center"}}>
                    {todoLists.map(el => {
                        let tasksForTodolist = tasks[el.id];

                        if (el.filter === "active") {
                            tasksForTodolist = tasks[el.id].filter(t => !t.isDone);
                        }
                        if (el.filter === "completed") {
                            tasksForTodolist = tasks[el.id].filter(t => t.isDone);
                        }
                        return (
                            <Grid item>
                                <Paper style={{padding: "10px"}}>
                                <Todolist
                                    key={el.id}
                                    id={el.id}
                                    title={el.title}
                                    tasks={tasksForTodolist}
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
