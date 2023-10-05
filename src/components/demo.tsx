import type { NextPage } from "next";

const Cover: NextPage = () => {
    return (
        <div className="relative bg-burlywood w-full h-[67.5rem] overflow-hidden text-left text-[1.44rem] text-neutral-primary-day font-open-sans">
            <div className="absolute top-[calc(50%_-_390.13px)] left-[calc(50%_-_693px)] bg-neutral-background-day shadow-[0px_4px_30px_rgba(0,_0,_0,_0.4)] w-[86.63rem] h-[48.73rem] overflow-hidden">
                <img
                    className="absolute top-[0rem] right-[0rem] w-[43.85rem] h-[48.73rem] object-cover"
                    alt=""
                    src="/right-image@2x.png"
                />
                <div className="absolute top-[calc(50%_-_174.77px)] left-[12.36rem] w-[18.05rem] flex flex-col items-center justify-center gap-[1.44rem]">
                    <div className="self-stretch flex flex-col items-center justify-center gap-[1.08rem]">
                        <div className="relative leading-[2.17rem] font-semibold">
                            Create account
                        </div>
                        <div className="self-stretch flex flex-col items-start justify-start gap-[1.08rem] text-[0.72rem] text-neutral-placeholder-day">
                            <div className="flex flex-col items-start justify-start text-gray">
                                <div className="w-[18.05rem] flex flex-row items-start justify-start z-[1]">
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <div className="self-stretch flex flex-row items-center justify-center pt-[0.72rem] px-[0.54rem] pb-[0.63rem]">
                                            <div className="relative leading-[1.08rem] font-semibold">
                                                by Email
                                            </div>
                                        </div>
                                        <div className="relative bg-gray w-[9.02rem] h-[0.09rem]" />
                                    </div>
                                    <div className="flex-1 overflow-hidden flex flex-row items-center justify-center py-[0.72rem] px-[0.54rem] gap-[0.18rem] text-neutral-secondary-day">
                                        <div className="relative leading-[1.08rem]">by Phone</div>
                                        <div className="relative leading-[1.08rem] font-inter text-grey-secondary-130 hidden">
                                            Default Tab title
                                        </div>
                                    </div>
                                </div>
                                <div className="relative bg-border-normal-day w-[18.05rem] h-[0.05rem] z-[0] mt-[-0.04rem]" />
                            </div>
                            <div className="self-stretch rounded-[8.66px] box-border h-[2.17rem] flex flex-row items-center justify-start py-[0.36rem] px-[0.54rem] border-[0.7px] border-solid border-border-normal-day">
                                <div className="relative leading-[1.08rem]">
                                    Enter your email
                                </div>
                            </div>
                            <div className="self-stretch rounded-[5.78px] box-border h-[2.17rem] flex flex-row items-center justify-between p-[0.54rem] border-[0.7px] border-solid border-border-normal-day">
                                <div className="relative leading-[1.08rem]">
                                    Create password
                                </div>
                                <img
                                    className="relative w-[0.9rem] h-[0.9rem]"
                                    alt=""
                                    src="/eye.svg"
                                />
                            </div>
                            <div className="self-stretch rounded-[5.78px] box-border h-[2.17rem] flex flex-row items-center justify-between p-[0.54rem] border-[0.7px] border-solid border-border-normal-day">
                                <div className="relative leading-[1.08rem]">
                                    Confirm password
                                </div>
                                <img
                                    className="relative w-[0.9rem] h-[0.9rem]"
                                    alt=""
                                    src="/eye1.svg"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[1.08rem] text-center text-[0.72rem] text-neutral-background-day">
                        <div className="rounded-[8.66px] bg-gray w-[18.05rem] flex flex-row items-center justify-center py-[0.54rem] px-[0.36rem] box-border">
                            <div className="relative leading-[1.08rem]">Continue</div>
                        </div>
                        <div className="w-[18.05rem] flex flex-col items-center justify-center gap-[0.27rem] text-neutral-secondary-day">
                            <div className="self-stretch relative leading-[1.08rem]">{`By signing up, I have read an agree to `}</div>
                            <div className="self-stretch relative leading-[1.08rem] text-semantic-1-hyperlink-day">
                                <span className="font-semibold">Terms</span>
                                <span className="text-neutral-secondary-day">{` and `}</span>
                                <span className="font-semibold">Privacy Policy</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[44.94rem] left-[17.01rem] flex flex-row items-center justify-start gap-[0.36rem] text-[0.72rem] text-neutral-secondary-day">
                    <div className="relative leading-[1.08rem]">Old Moonsooner?</div>
                    <div className="relative leading-[1.08rem] font-semibold text-semantic-1-hyperlink-day text-center">
                        Sign in
                    </div>
                </div>
                <div className="absolute top-[2.71rem] left-[19.13rem] w-[4.51rem] h-[3.61rem] flex flex-col items-center justify-center gap-[0.45rem] text-[0.54rem] font-nunito">
                    <img
                        className="relative w-[4.19rem] h-[2.12rem]"
                        alt=""
                        src="/layer-x0020-1.svg"
                    />
                    <div className="relative tracking-[0.29em] leading-[0.72rem] font-extrabold">
                        MOONSOON
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cover;
