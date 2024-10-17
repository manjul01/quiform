import React from 'react'

function ErrorBar(props) {
  return (
    <>
        <div className="w-full text-center bg-red-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300">
            {props.mess}
        </div>
    </>
  )
}

export default ErrorBar