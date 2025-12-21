import React from 'react'
import {Lukeck} from 'react-icons/lu';

const Toast = (isShow, message, type) => {
  return (
    <div>
            <div className='flex items-centre gap-3 py-2 px-4 '>
                <div className=''>
                    <LuCheck className = 'text-green-500'/>
                </div>
                <p className='text-sm text-slate-800'>Note Added Successfully</p>
            </div>
    </div>
  )
}

export default Toast