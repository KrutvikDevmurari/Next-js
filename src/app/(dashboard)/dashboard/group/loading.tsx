import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface LoadingProps { }

const Loading: FC<LoadingProps> = ({ }) => {
    return (
        <div className="w-full md:w-2/3 h-full">
            <div className="text-start md:min-w-min w-full pl-4 md:w-1/2">
                <label className="mt-5 block mb-1 font-bold">
                    <Skeleton width={200} height={20} />
                </label>
                {/* <input
                    type="text"
                    className="block w-full mb-2 rounded-md border-2 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Best Group"
                    disabled
                /> */}
                <div className="mt-1 text-sm text-red-600">
                    <Skeleton width={300} height={16} />
                </div>
            </div>
            <div className="mt-5 block mb-1 pl-4 font-bold">
                <Skeleton width={300} height={20} />
            </div>
            <div className="mt-4 p-4 border rounded-lg flex items-center w-full md:w-2/3 overflow-auto max-h-56">
                {/* <input type="checkbox" className="rounded-full cursor-pointer h-6 w-6" disabled /> */}
                <div className="flex items-center ml-3 cursor-pointer">
                    <Skeleton circle={true} height={40} width={40} />
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-slate-900">
                            <Skeleton width={100} height={16} />
                        </p>
                        <p className="text-sm text-slate-500">
                            <Skeleton width={150} height={16} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center pl-4 mt-2 md:min-w-min md:w-1/2">
                <button className="mt-3 md:mt-0 min-w-full" disabled>
                    <Skeleton width={150} height={40} />
                </button>
            </div>
        </div>
    );
};

export default Loading;
