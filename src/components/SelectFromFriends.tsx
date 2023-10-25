"use client"
import { FC } from 'react'
import Image from 'next/image'
import Button from './UI/Button'
import axios from 'axios'
import toast from 'react-hot-toast'

interface SelectFromFriendsProps {
    friends: any,
    selectedUsers: any,
    handleDivClick: any,
    isUserUpdate: any,
    groupId: any,
    groupInfo: any,
    session: any
}


const SelectFromFriends: FC<SelectFromFriendsProps> = ({ groupId, friends, selectedUsers, handleDivClick, isUserUpdate, groupInfo, session }) => {
    const RemoveUserHandler = async (id: any, groupId: any) => {
        const removedUser = await axios.post('/api/group/remove', { id, groupId }).then((res) => {
            toast.success("User Removed Sucessfully") && window.location.reload()
        })
    }
    const updateFriends = friends.filter((friend: any) =>
        isUserUpdate && groupInfo.users.find((groupUser: any) => groupUser.id === friend._id)
    );
    const nonGroupFriends = friends.filter((friend: any) =>
        isUserUpdate && !groupInfo.users.some((groupUser: any) => groupUser.id.toString() === friend._id.toString())
    );

    return <>
        {(isUserUpdate ? updateFriends.length > 0 : friends.length > 0) && <p className="mt-5 block mb-1 pl-4 font-bold text-center">Select from friends listed below</p>}
        {(isUserUpdate ? updateFriends : friends).map((res: any) => (
            <div className='flex  items-center '>
                <div key={res._id} className="mt-4 p-4 border rounded-lg flex items-center w-72 max-w-sm  max-h-56 mx-auto">
                    {!isUserUpdate && <input
                        type="checkbox"
                        checked={selectedUsers.some((user: any) => user.id === res._id)}
                        onChange={() => {
                            !isUserUpdate &&
                                handleDivClick(res)
                        }}
                        className="rounded-full cursor-pointer h-6 w-6"
                    />}
                    <div className="flex items-center ml-3 cursor-pointer" onClick={() => { !isUserUpdate && handleDivClick(res) }}>
                        <Image
                            referrerPolicy='no-referrer'
                            unoptimized={true}
                            src={res.image.includes("http") ? res.image : `/uploads/profiles/${res.image}`}
                            alt={`profile picture`}
                            height={"10"}
                            width={"10"}
                            className='rounded-full h-10 w-10'
                        />

                        <div className="ml-3  overflow-hidden">
                            <p className="text-sm font-medium text-slate-900">{res.name}</p>
                            <p className="text-sm text-slate-500 truncate">{res.email}</p>
                        </div>
                    </div>
                </div>

                {isUserUpdate && ((session.user.id === groupInfo.createdBy) && <Button onClick={() => RemoveUserHandler(res._id, groupId)} type='button' className=''>Remove</Button>)}
            </div>
        ))}
        {(isUserUpdate && nonGroupFriends.length > 0) && <p className="mt-5 block mb-1 pl-4 font-bold text-center">Your Friends</p>}
        {isUserUpdate && nonGroupFriends.map((res: any) => (
            <div className='flex  items-center '>
                <div key={res._id} className="mt-4 p-4 border rounded-lg flex items-center w-72 max-w-sm  max-h-56 mx-auto">
                    {<input
                        type="checkbox"
                        checked={selectedUsers.some((user: any) => user.id === res._id)}
                        onChange={() => {
                            handleDivClick(res)
                        }}
                        className="rounded-full cursor-pointer h-6 w-6"
                    />}
                    <div className="flex items-center ml-3 cursor-pointer" onClick={() => { handleDivClick(res) }}>
                        <Image
                            referrerPolicy='no-referrer'
                            unoptimized={true}
                            src={res.image.includes("http") ? res.image : `/uploads/profiles/${res.image}`}
                            alt={`profile picture`}
                            height={"10"}
                            width={"10"}
                            className='rounded-full h-10 w-10'
                        />

                        <div className="ml-3  overflow-hidden">
                            <p className="text-sm font-medium text-slate-900">{res.name}</p>
                            <p className="text-sm text-slate-500 truncate">{res.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </>
}

export default SelectFromFriends