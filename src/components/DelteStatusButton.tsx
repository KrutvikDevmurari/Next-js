"use client"
import axios, { AxiosError } from 'axios'
import { Loader2, Trash } from 'lucide-react'
import { FC } from 'react'
import toast from 'react-hot-toast'

interface DelteStatusButtonProps {
    setDeleteloading: any,
    deleteloading: boolean
}

const DelteStatusButton: FC<DelteStatusButtonProps> = ({ setDeleteloading, deleteloading }) => {
    const DeleteStatusHandler = async () => {
        setDeleteloading(true)
        try {
            await axios.delete('/api/status/delete')
            toast.success('Status Deleted Sucessfully')
            setDeleteloading(false)
            window.location.reload()
        } catch (error: any) {
            if (error instanceof AxiosError) {
                toast.error("Something went wrong")
                return
            }
            toast.error('Something went wrong.')
        }
    }
    return <div className="bg-white bg-opacity-75 p-2 rounded-full cursor-pointer" onClick={DeleteStatusHandler}>
        {deleteloading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Trash className="text-red-500 text-xl" />}
    </div>
}

export default DelteStatusButton