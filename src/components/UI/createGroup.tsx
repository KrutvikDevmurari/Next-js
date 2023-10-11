'use client'
import axios, { AxiosError } from 'axios'
import { ChangeEvent, FC, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from './Button'
import { Loader2 } from 'lucide-react'
import { createGroupValidator } from '@/lib/validations/createGroupValidator'
import Image from 'next/image'

interface CreateGroup {
    friends: any
}

type FormData = z.infer<typeof createGroupValidator>

const CreateGroup: FC<CreateGroup> = ({ friends }) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    const [groupName, setGroupName] = useState("")
    const [isloading, setIsloading] = useState<boolean>(false)
    const [selectedUsers, setSelectedUsers] = useState<any[]>([])
    const [image, setImage]: any = useState("groupchat.png")
    console.log(selectedUsers, "selectedUsers")
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files ? e.target.files[0] : null;
        const imageFile2 = e.target.files ? URL.createObjectURL(e.target.files[0]) : null;
        setImage(imageFile2)

    };
    const handleDivClick = (res: any) => {
        const isSelected = selectedUsers.includes(res);
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter(user => user !== res));
        } else {
            setSelectedUsers([...selectedUsers, res]);
        }
    }

    const GroupChangeHandler = (e: any) => {
        setGroupName(e.target.value);
    }

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(createGroupValidator),
    })

    const createGroup = async (res: string) => {
        const selectedId = selectedUsers.map(res => res._id)
        if (groupName.length > 0) {
            if (selectedUsers.length > 0) {
                try {
                    await axios.post('/api/group/create', {
                        groupName,
                        groupImage: image,
                        users: selectedId

                    })
                    setShowSuccessState(true)
                    setGroupName("");
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        setError('groupName', { message: error.message })
                        return
                    }

                    if (error instanceof AxiosError) {
                        setError('groupName', { message: error.response?.data?.message })
                        return
                    }

                    setError('groupName', { message: 'Something went wrong.' })
                }
            } else {
                setError('groupName', { message: "You Cannot Create Group Without Members" })
            }
        } else {
            setError('groupName', { message: 'Group name is Required' })
        }
    }

    const onSubmit = (data: FormData) => {
        setShowSuccessState(false)
        setIsloading(true)
        isloading ? "" : (createGroup(data.groupName).then(res => {
            setIsloading(false)
        }))

    }

    return (
        <form className="max-w-2xl px-4 py-8 mx-auto lg:py-16 h-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-6 ml-2 sm:col-span-4 md:mr-3">
                <input type="file" className="hidden" name="image" id="fileInput" onChange={(e: any) => {
                    handleImageChange(e)
                }} />

                <label className="block text-gray-700 text-sm font-bold mb-2 text-center" >
                    Profile Photo <span className="text-red-600"> </span>
                </label>

                <div className="text-center">
                    <div className="mt-2">
                        <Image
                            src={image.includes("http") ? image : `/uploads/group/${image}`}
                            alt=""
                            quality={100}
                            unoptimized={true}
                            className="w-40 h-40 m-auto rounded-full shadow"
                            width={"50"}
                            height={"50"}
                        />
                    </div>
                    <div className="mt-2" style={{ display: "none" }}>
                        <span className="block w-40 h-40 rounded-full m-auto shadow" style={{ backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center", backgroundImage: "" }}>
                        </span>
                    </div>
                    <button type="button" className={"inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3"} onClick={() => {
                        document?.getElementById('fileInput')?.click()
                    }}>
                        Select New Photo
                    </button>
                </div>
            </div>
            <div className="text-start md:min-w-min w-full pl-4 mx-auto md:w-1/2">
                <label className="mt-5 block mb-1 font-bold">Enter Group name</label>
                <input
                    {...register('groupName')}
                    value={groupName}
                    onChange={(e) => GroupChangeHandler(e)}
                    type="text"
                    className={`block w-full mb-2 rounded-md border-2 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${isloading ? 'opacity-50' : ''
                        }`}
                    placeholder="Best Group"
                />
                <p className="mt-1 text-sm text-red-600">{errors.groupName?.message}</p>
                <p className="mt-5 block mb-1 pl-4 font-bold">Select from friends listed below</p>
            </div>
            {friends.map((res: any) => (
                <div key={res._id} className="mt-4 p-4 border rounded-lg flex items-center w-full md:w-2/3 overflow-auto max-h-56 mx-auto">
                    <input
                        type="checkbox"
                        checked={selectedUsers.includes(res)}
                        onChange={() => handleDivClick(res)}
                        className="rounded-full cursor-pointer h-6 w-6"
                    />
                    <div className="flex items-center ml-3 cursor-pointer" onClick={() => handleDivClick(res)}>
                        {/* <img
                            className="h-10 w-10 rounded-full"
                            src={res.image?.includes('http') ? res.image : `/uploads/profiles/${res.image}`}
                            alt=""
                        /> */}
                        <Image
                            referrerPolicy='no-referrer'
                            unoptimized={true}
                            src={res.image.includes("http") ? res.image : `/uploads/profiles/${res.image}`}
                            alt={`profile picture`}
                            height={"10"}
                            width={"10"}
                            className='rounded-full h-10 w-10'
                        />
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-slate-900">{res.name}</p>
                            <p className="text-sm text-slate-500 truncate">{res.email}</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-center items-center pl-4 mt-2 md:min-w-min md:w-1/2 mx-auto ">

                <Button className="mt-3 md:mt-0 min-w-full" disabled={isloading}>
                    {isloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Group'}
                </Button>
            </div>
        </form>

    )
}

export default CreateGroup
