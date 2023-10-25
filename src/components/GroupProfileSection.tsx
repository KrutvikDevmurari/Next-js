"use client"
import { FC } from 'react'
import ProfilePhotoSection from './UI/ProfilePhotoSection'

interface GroupProfileSectionProps {
    handleImageChange: any,
    mainimage: any,
    register: any,
    groupName: any,
    GroupChangeHandler: any,
    errors: any,
    isloading: boolean
}

const GroupProfileSection: FC<GroupProfileSectionProps> = ({ handleImageChange, mainimage, register, GroupChangeHandler, groupName, errors, isloading }) => {
    const storageLocation = "/uploads/group/"
    const header = "Group Profile Photo"
    return <>
        <ProfilePhotoSection handleImageChange={handleImageChange} image={mainimage} storageLocation={storageLocation} header={header} />
        <div className="text-start w-full md:min-w-min pl-4 mx-auto md:w-1/2">
            <label className="mt-5 block mb-1 font-bold">Enter Group name</label>
            <input
                {...register('groupName')}
                value={groupName}
                onChange={(e) => GroupChangeHandler(e)}
                type="text"
                className={`block w-full mb-2 rounded-md border-2 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${isloading ? 'opacity-50' : ''}`}
                placeholder="Best Group"
            />
            {/* <p className="mt-1 text-sm text-red-600">{errors.groupName?.message}</p> */}
        </div>
    </>
}

export default GroupProfileSection