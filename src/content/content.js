import React, { useState } from 'react'
export default function Content() {


    const [input, setInput] = useState("")
    const [list, setList] = useState([])


    const update = (e) => {
        setInput(e.target.value)
        
    }


    const handleKeyDownforSubmit = (event) => {
        if (event.key === 'Enter') {
          update2();
        }
      };

    const update2 = () => {
        if(!(input.length=="")){
        setList((x) => {
            return [...x, input]
        })}
        setInput("")
    }



    const deletetodo = (x) => {
        let f=[...list]
        f.splice(x,1)
        setList(f)
    }




    return (
        <div >
            <div className="d-flex justify-content-sm-center">
           
            <input  className="h-100  w-50 p-3" id="text" placeholder='Enter here to do' onKeyDown={handleKeyDownforSubmit}  onChange={update} value={input}></input>
            <button className="btn btn-success h-25 w-5 p-3 mx-4 " onClick={update2}>Submit</button>
            </div>
            
           <div className="row justify-content-center mx-5 my-5"> 
            <ul className="col-auto col-md-5">
                {list.map((val, i) =>
                    <li  className="h-100w-100 float-left p-1" >{val}<button class="btn  border border-dar flex-right   btn-danger m-1  "  onClick={() => deletetodo(i)}>Delete</button></li>)}
            </ul>
            </div>

        </div>
    )

}