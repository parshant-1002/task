import React, { useState } from 'react'
export default function Content() {

    const [input, setInput] = useState("")
    const [list, setList] = useState([])
    const handleChangeTodo = (e) => {
        setInput(e.target.value)
    }

    const handleKeyDownforSubmit = (event) => {
        if (event.key === 'Enter') {
            handleAddTodo();
        }
    };

    const handleAddTodo = () => {
        if (input) {
            setList((x) => ([...x, input]))
        }
        setInput("")
    }

    const deletetodo = (x) => {
        let f = [...list]
        f.splice(x, 1)
        setList(f)
    }

    return (
        <div >
            <div className="d-flex justify-content-sm-center">
                <input
                    className="h-100  w-50 p-3"
                    id="text"
                    placeholder='Enter here to do'
                    onKeyDown={handleKeyDownforSubmit}
                    onChange={handleChangeTodo}
                    value={input}
                />
                <button
                    className="btn btn-success h-25 w-5 p-3 mx-4 "
                    onClick={handleAddTodo}
                >Submit
                </button>
            </div>
            <div className="row justify-content-center mx-5 my-5">
                <ul className="col-auto col-md-7">
                    {list.map((val, i) =>
                        <li
                            key={val + i}
                            className="w-100 d-flex p-1 border border-dark m-2 rounded"
                        >
                            <label className='w-100'>{val}</label>
                            <button
                                class="btn w-25 border border-dar flex-right btn-danger m-1  "
                                onClick={() => deletetodo(i)}>
                                Delete
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )

}