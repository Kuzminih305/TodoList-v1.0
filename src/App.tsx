import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {SuperInput} from "./components/SuperInput";
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodolistAC,
    changeFilterAC,
    editTodoAC,
    removeTodolistAC,
    todolistsReducer
} from "./reducers/todolistsReducer";
import {
    addTaskAC,
    changeStatusAC,
    editTaskAC,
    newTasksForNewTodoListAC,
    removeTaskAC,
    tasksReducer
} from "./reducers/tasksReducer";

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

    let todolistID1 = v1();
    let todolistID2 = v1();

    const [todolists, todolistsDispatch] = useReducer(todolistsReducer, [
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ])

    const [tasks, tasksDispatch] = useReducer(tasksReducer, {
            [todolistID1]: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "Rest API", isDone: false},
                {id: v1(), title: "GraphQL", isDone: false},
            ],
            [todolistID2]: [
                {id: v1(), title: "HTML&CSS2", isDone: true},
                {id: v1(), title: "JS2", isDone: true},
                {id: v1(), title: "ReactJS2", isDone: false},
                {id: v1(), title: "Rest API2", isDone: false},
                {id: v1(), title: "GraphQL2", isDone: false},
            ]
    });

    const editTask = (todolistId: string, taskId: string ,newTitle: string) => {
        tasksDispatch(editTaskAC(todolistId, taskId, newTitle))
        // const editVal = {...tasks,[todolistId]: tasks[todolistId].map(el => el.id === taskId ? {...el, title: newTitle} : el)}
        // setTasks(editVal)
    }
    const editTodo = (todolistId: string, newTitle: string) => {
        todolistsDispatch(editTodoAC(todolistId, newTitle))
        // setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: newTitle} : el))
    }

    function removeTodolist(id: string) {
        todolistsDispatch(removeTodolistAC(id))
        delete tasks[id]
        // setTodolists(todolists.filter(el => el.id !== id))

    }

    function removeTask(todolistId: string ,id: string) {
        tasksDispatch(removeTaskAC(todolistId,id))
        // setTasks({...tasks, [todolistId]: tasks[todolistId].filter(el => el.id !== id)})
        // // let filteredTasks = tasks.filter(t => t.id != id);
        // // setTasks(filteredTasks);
    }

    function addTask(todolistId: string,title: string) {
        tasksDispatch(addTaskAC(todolistId, title))
         // let newTask = {id: v1(), title: title, isDone: false};
         // setTasks({...tasks, [todolistId]: [newTask,...tasks[todolistId]]})

        // let newTasks = [task, ...tasks];
        // setTasks(newTasks);
    }

    function changeStatus(todolistId: string,taskId: string, isDone: boolean) {
        tasksDispatch(changeStatusAC(todolistId,taskId,isDone))
        // setTasks({...tasks, [todolistId]: tasks[todolistId].map(el => el.id === taskId ? {...el, isDone}: el)})
        // let task = tasks.find(t => t.id === taskId);
        // if (task) {
        //     task.isDone = isDone;
        // }
        //
        // setTasks([...tasks]);
    }




    function changeFilter(todolistId: string ,value: FilterValuesType) {
        todolistsDispatch(changeFilterAC(todolistId, value))
        // setTodolists(todolists.map(el => el.id === todolistId ? {...el, filter: value} : el))
        // setFilter(value);
    }

    function addTodolist(title: string) {
        let newTodoListId = v1()
        todolistsDispatch(addTodolistAC(title, newTodoListId))
        tasksDispatch(newTasksForNewTodoListAC(newTodoListId))
    }


    return (
        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{padding: "10px", justifyContent: "center"}}>
                    <SuperInput callBack={addTodolist}/>
                </Grid>
                <Grid container spacing={3} style={{justifyContent: "center"}}>
                    {todolists.map(el => {
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
