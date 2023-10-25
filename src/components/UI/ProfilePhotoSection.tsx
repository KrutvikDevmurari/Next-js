import { FC } from 'react'
import Image from 'next/image'

interface ProfilePhotoSectionProps {
    handleImageChange: any,
    image: any,
    storageLocation: string,
    header: string
}

const ProfilePhotoSection: FC<ProfilePhotoSectionProps> = ({ handleImageChange, image, storageLocation, header }) => {
    console.log(`${storageLocation}${image}`, "`${storageLocation}${image}`")
    return <div className="col-span-6 ml-2 sm:col-span-4 md:mr-3">
        <input type="file" className="hidden" name="image" id="fileInput" onChange={(e: any) => {
            handleImageChange(e)
        }} />

        <label className="block text-gray-700 text-sm font-bold mb-2 text-center" >
            {header} <span className="text-red-600"> </span>
        </label>

        <div className="text-center">
            <div className="mt-2">
                <Image
                    src={image.includes("http") ? image : `${storageLocation}${image}`}
                    alt="no image "
                    // quality={100}
                    // unoptimized={true}
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
}

export default ProfilePhotoSection