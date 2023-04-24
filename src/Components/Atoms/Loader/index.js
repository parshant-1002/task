import React from 'react'
import "./styles.css"
export default function Loader({show}) {
    console.log(show,"kikhkhjkghjghjvghjghj")
  return (
    <>
   {show && <div className='LoaderDiv'>
    <div class="loader"></div>
    </div>}
    </>
  )
}
