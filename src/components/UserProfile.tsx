"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import axios from 'axios';
import Button from './UI/Button';

interface FormData {
    image: File | null;
    name: string;
    email: string;
}

const UserProfile: any = ({ session }: any) => {
    const [formData, setFormData]: any = useState<FormData>({
        image: session.user.image,
        name: session.user.name,
        email: session.user.email,
    });
    const [image, setImage] = useState(session.user.image)
    const [isloading, setIsloading] = useState(false)
    const [apiMessage, setapiMessage] = useState("")
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files ? e.target.files[0] : null;
        const imageFile2 = e.target.files ? URL.createObjectURL(e.target.files[0]) : null;
        setFormData({
            ...formData,
            image: imageFile as File,
        });
        setImage(imageFile2)
    };
    console.log(image, "image")
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsloading(true)
        const formDataToSend = new FormData();
        formDataToSend.append('image', session.user.image === formData.image ? null : formData.image);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        axios.post('/api/user/update', formDataToSend).then((res: any) => {
            setIsloading(false)
            window.location.reload()
            setapiMessage(res.message)
        }).catch((err: any) => {
            console.log(err, "err")
            setapiMessage(err?.response?.data?.message)
            setIsloading(false)
        })
    };


    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update User</h2>
                <form onSubmit={handleSubmit} encType='multipart/form-data' >
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
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
                                            src={image.includes("http") ? image : `/uploads/profiles/${image}`}
                                            alt=""
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
                        </div>
                        <div className="w-full">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 justify-center">
                        <Button type="submit" isLoading={isloading} className="text-white bg-teal-800 hover:bg-teal-950 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Update User
                        </Button>
                    </div>
                    <p className='text-red-500 align-middle'>{apiMessage}</p>
                </form>
            </div>
        </section>
    );
}

export default UserProfile;
