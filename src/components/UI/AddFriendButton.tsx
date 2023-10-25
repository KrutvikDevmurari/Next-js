'use client'

import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { FC, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from './Button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface AddFriendButtonProps { }

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
    const [isloading, setIsloading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator),
    })

    const addFriend = async (email: string) => {
        try {
            await axios.post('/api/friends/add', {
                email,
            })
            toast.success('Request Sent Sucessfully')
            reset();
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('email', { message: error.message })
                toast.error(error.message)
                return
            }

            if (error instanceof AxiosError) {
                // setError('email', { message: error.response?.data?.message })
                toast.error(error.response?.data?.message)
                reset();
                return
            }

            // setError('email', { message: 'Something went wrong.' })
            toast.error('Something went wrong.')
        }
    }

    const onSubmit = (data: FormData) => {
        setIsloading(true)
        isloading ? "" : (addFriend(data.email).then(res => {
            setIsloading(false)
        }))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm pl-4'>
            <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Add friend by E-Mail
            </label>

            <div className='mt-2 flex gap-4'>
                <input
                    {...register('email')}
                    type='text'
                    className={'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' + (isloading ? "disabled:" : "")}
                    placeholder='you@example.com'
                />
                <Button disabled={isloading}>{isloading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : "Add"}</Button>
            </div>
            <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
        </form>
    )
}

export default AddFriendButton