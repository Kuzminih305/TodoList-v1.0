import React, {ChangeEvent, useState} from 'react';

type PropsType = {
    oldTitle: string
    callBack: (newTask: string) => void
}

export const EditableSpan = (props: PropsType) => {
    let [newTitle, setNewTitle] = useState(props.oldTitle)
    const [edit, setEdit] = useState(false)

    const editFooHandler = () => {
        setEdit(!edit)
        props.callBack(newTitle)
    }


    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    return (
        edit
            ? <input onChange={onChangeHandler} value={newTitle} onBlur={editFooHandler} autoFocus/>
            : <span onDoubleClick={editFooHandler}>{props.oldTitle}</span>
    );
};
