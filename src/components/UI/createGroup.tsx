'use client'
import axios, { AxiosError } from 'axios'
import { ChangeEvent, FC, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from './Button'
import { Loader2 } from 'lucide-react'
import { createGroupValidator } from '@/lib/validations/createGroupValidator'
import { toast } from 'react-hot-toast'
import SelectFromFriends from '../SelectFromFriends'
import GroupProfileSection from '../GroupProfileSection'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'


interface CreateGroup {
    friends: any,
    session: any,
    groupInfo?: any
}

type FormData = z.infer<typeof createGroupValidator>

const CreateGroup: FC<CreateGroup> = ({ friends, session, groupInfo }) => {
    const pathname = usePathname()
    const isUserUpdate = pathname?.includes('update')
    const [isloading, setIsloading] = useState<boolean>(false)
    const idArray = groupInfo?.users.map((item: any) => { return { id: item.id } });
    const [formData, setFormData] = useState<any>({
        selectedUsers: isUserUpdate ? idArray : [{ id: session.user.id }],
        groupName: isUserUpdate ? groupInfo.groupname : "",
        image: isUserUpdate ? groupInfo.groupImage : "groupchat.png"
    });
    const router = useRouter()
    const [mainimage, setMainImage] = useState<any>(isUserUpdate ? groupInfo.groupImage : "groupchat.png");
    const { selectedUsers, groupName, image } = formData;
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files ? e.target.files[0] : null;
        const imageFile2 = e.target.files ? URL.createObjectURL(e.target.files[0]) : null;
        setMainImage(imageFile2)
        setFormData({
            ...formData,
            image: imageFile
        });
    };


    const handleDivClick = (res: any) => {
        console.log("hiii")
        // Check if the user is already selected
        const isSelected = selectedUsers.some((user: any) => user.id === res._id);

        if (isSelected) {
            // Remove the user from the selectedUsers array
            const updatedSelectedUsers = selectedUsers.filter((user: any) => user.id !== res._id);

            setFormData({
                ...formData,
                selectedUsers: updatedSelectedUsers
            });
        } else {
            // Add the user to the selectedUsers array
            setFormData({
                ...formData,
                selectedUsers: [...selectedUsers, { id: res._id }]
            });
        }
    }

    const GroupChangeHandler = (e: any) => {
        setFormData({
            ...formData,
            groupName: e.target.value
        });
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
        const formDataToSend = new FormData();
        formDataToSend.append('groupImage', image);
        formDataToSend.append('selectedUsers', JSON.stringify(selectedUsers));
        formDataToSend.append('groupName', groupName);
        isUserUpdate && formDataToSend.append("groupId", groupInfo._id)
        isUserUpdate && formDataToSend.append("createdBy", groupInfo.createdBy)
        if (groupName.length > 0) {
            if (selectedUsers.length > 1) {
                if (image !== 'groupchat.png' && image !== "") {
                    try {
                        isUserUpdate ? await axios.post('/api/group/update', formDataToSend) : await axios.post('/api/group/create', formDataToSend)
                        setFormData({
                            ...formData,
                            groupName: "",
                            image: '',
                            selectedUsers: []
                        });
                        toast.success(isUserUpdate ? "Group updated sucessfully" : "Group created sucessfully") && window.location.reload()
                    } catch (error) {
                        setFormData({
                            ...formData,
                            groupName: "",
                            image: '',
                            selectedUsers: []
                        });
                        if (error instanceof z.ZodError) {
                            setError('groupName', { message: error.message })
                            toast.error(error.message || '')
                            return
                        }

                        if (error instanceof AxiosError) {
                            setError('groupName', { message: error.response?.data?.message })
                            toast.error(error.response?.data?.message || '')
                            return
                        }

                        setError('groupName', { message: 'Something went wrong.' })
                        toast.error('Something went wrong.' || '')
                    }
                } else {
                    toast.error("Please Select a Image" || '')
                }
            } else {

                setError('groupName', { message: "You Cannot Create Group Without Members" })
                toast.error("You cannot have group without members" || '')
            }
        } else {
            setError('groupName', { message: 'Group name is Required' })
            toast.error('Group name is required' || '')
        }
    }
    const onSubmit = (data: any) => {
        data.preventDefault()
        setIsloading(true)
        isloading ? "" : (createGroup(data.groupName).then(res => {
            setIsloading(false)
        }))
    }

    const handleLeaveGroup = () => {
        axios.post('/api/group/leave', { id: session.user.id, groupId: groupInfo._id }).then(res => {
            router.push('/dashboard/add')
        })
    }
    return (
        <form className="max-w-2xl px-4 py-8 mx-auto  h-full md:px-8 lg:px-12" onSubmit={(e: any) => onSubmit(e)}>
            <GroupProfileSection handleImageChange={handleImageChange} mainimage={mainimage} register={register} groupName={groupName} GroupChangeHandler={GroupChangeHandler} errors={errors} isloading={isloading} />
            <SelectFromFriends groupId={groupInfo?._id} isUserUpdate={isUserUpdate} friends={friends} selectedUsers={selectedUsers} handleDivClick={handleDivClick} groupInfo={groupInfo} session={session} />
            {(isUserUpdate ? session.user.id === groupInfo.createdBy : true) && <div className="flex justify-center items-center pl-4 mt-2 w-full md:w-1/2 mx-auto">
                <Button className="mt-3 md:mt-0 min-w-full" disabled={isloading}>
                    {isloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isUserUpdate ? 'Update Group' : 'Create Group')}
                </Button>
            </div>}
            {isUserUpdate && session.user.id !== groupInfo.createdBy && <div className="flex justify-center items-center pl-4 mt-2 w-full md:w-1/2 mx-auto">
                <Button className="mt-3 md:mt-0 min-w-full" type='button' onClick={() => handleLeaveGroup()} disabled={isloading}>
                    {isloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Leave Group'}
                </Button>
            </div>}
        </form>

    )
}

export default CreateGroup
