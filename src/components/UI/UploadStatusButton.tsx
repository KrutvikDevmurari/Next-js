'use client'

import axios, { AxiosError } from 'axios'
import { FC, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from './Button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { uploadStatusValidor } from '@/lib/validations/uploadstatus'
import { format } from 'date-fns';
import DelteStatusButton from '../DelteStatusButton'

interface UploadStatusProps { }

type FormData = z.infer<typeof uploadStatusValidor>

const UploadStatusButton: FC<UploadStatusProps> = ({ }) => {
    const [isloading, setIsloading] = useState<boolean>(false)
    const [deleteloading, setDeleteloading] = useState<boolean>(false)
    const [session, setSession] = useState<any>()
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(uploadStatusValidor),
    })

    const addFriend = async (status: string) => {
        try {
            await axios.post('/api/status/upload', {
                text: status,
            })
            toast.success('Request Sent Sucessfully')
            reset();
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('status', { message: error.message })
                toast.error(error.message)
                return
            }

            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message)
                reset();
                return
            }
            toast.error('Something went wrong.')
        }
    }



    const onSubmit = (data: FormData) => {
        setIsloading(true)
        isloading ? "" : (addFriend(data.status).then(res => {
            setIsloading(false)
        }))
    }
    useEffect(() => {
        try {
            axios.get('/api/status/get').then((res: any) => {
                setSession(res);
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('status', { message: error.message })
                toast.error(error.message)
                return
            }

            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message)
                reset();
                return
            }
            toast.error('Something went wrong.')
        }
    }, [isloading, deleteloading])
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm pl-4'>
                <label
                    htmlFor='status'
                    className='block text-sm font-medium leading-6 text-gray-900'>
                    Enter your status here
                </label>

                <div className='mt-2 flex gap-4'>
                    <input
                        {...register('status')}
                        type='text'
                        className={'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' + (isloading ? "disabled:" : "")}
                        placeholder='Example : "Quote of the day"'
                    />
                    <Button disabled={isloading}>{isloading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : "Upload"}</Button>
                </div>
                <p className='mt-1 text-sm text-red-600'>{errors.status?.message}</p>
            </form>
            {session?.data.data && session?.data.data.length > 0 && (
                <div className="ml-4 relative">
                    <h2 className="font-bold text-4xl mt-4 mb-8">Preview:</h2>
                    <div className="w-full max-w-md relative group">
                        <div className="relative">
                            <div className="bg-blue-500 text-white p-8 rounded-lg">
                                <p className="font-bold text-3xl mt-4 mb-4">
                                    {session?.data.data[0].text}
                                </p>
                                <p className="text-gray-300">
                                    Posted at {format(session?.data.data[0].timestamp, 'HH:mm')}
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 flex items-center justify-center group-hover:opacity-100">
                                <DelteStatusButton setDeleteloading={setDeleteloading} deleteloading={deleteloading} />
                            </div>
                        </div>
                    </div>
                </div>

            )
            }
        </>
    )
}

export default UploadStatusButton