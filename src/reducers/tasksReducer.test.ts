import {addTaskAC, removeTaskAC, tasksReducer} from './tasksReducer'
import {TasksStateType} from '../App'
import {TaskStatuses} from "../api/api";
import {addTodolistAC} from "./todolistsReducer";


const startState: TasksStateType = {
    'todolistId1': [
        // {id: '1', title: 'CSS', isDone: false},
        // {id: '2', title: 'JS', isDone: true},
        // {id: '3', title: 'React', isDone: false}
    ],
    'todolistId2': [
        // {id: '1', title: 'bread', status: false},
        // {id: '2', title: 'milk', status: true},
        // {id: '3', title: 'tea', isDone: false}
    ]
}




test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('todolistId2', '2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '3', title: 'tea', isDone: false}
        ]
    })
})

//-----------------------------------------------------------------------

test('correct task should be added to correct array', () => {

    const action = addTaskAC({
        todoListId: 'todolistId2',
        title: 'juce',
        status: TaskStatuses.New,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: 0,
        startDate: "",
        id: "id exist"
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(false)
})

//-----------------------------------------------------------------------

// test('status of specified task should be changed', () => {
//
//
//     const action = changeStatusAC('todolistId2', '2', )
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState['todolistId2'][1].status).toBe(false)
//     expect(endState['todolistId1'][0].status).toBe(false)
// })

//--------------------------------------------------------------------------------------

// test('title of specified task should be changed', () => {
//
//
//     const action = editTaskAC('todolistId2', '2', 'beer')
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState['todolistId2'][1].title).toBe('beer')
//     expect(endState['todolistId1'][0].title).toBe('CSS')
// })

 //--------------------------------------------------------------------------------

test('new array should be added when new todolist is added', () => {


    // const action = addTodolistAC('new todolist')
    const action = addTodolistAC({
        id: 'new todolist',
        title: "",
        addedDate: "",
        order: 0,
        }

    )

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

// //-----------------------------------------------------------------------------------

// test('property with todolistId should be deleted', () => {
//
//
//     const action = removeTodolistAC('todolistId2')
//
//     const endState = tasksReducer(startState, action)
//
//
//     const keys = Object.keys(endState)
//
//     expect(keys.length).toBe(1)
//     expect(endState['todolistId2']).not.toBeDefined()
// })

