import Link from "next/link";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface Keys{
    publicKey:string;
    secretKey:string;
    indexNo:string;
}

export const Wallets = ({keysList,setPairs}:{keysList:Keys[],setPairs:Dispatch<SetStateAction<Keys[]>>}) => {

    const copyKey = async(key:string,type:string) => {
        await navigator.clipboard.writeText(key);
        if(type === "secret"){
            toast("Copied the Secret Key !!");
        }
        else{
            toast("Copied the Public Key !!");
        }
    }

    const deleteWallet = (indexNo:string) => {
        const counts = localStorage.getItem("count");
        if(!counts){
            toast("Can't find the index no");
            return;
        }

        const countArr = counts.split(" ");
        const newArr = countArr.filter( i => i!== indexNo);
        
        localStorage.setItem("count",newArr.join(" "));
        setPairs( p => p.filter((key) => key.indexNo !== indexNo));
        
    }


    return (
        <div className="flex flex-col">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl my-5">
                Solana Wallets
            </h1>

            <div className="flex flex-col">
                {
                    keysList.map((key,ind)=> (

                        <div className="border rounded-xl p-5 mb-5" key={key.publicKey}>

                            <div className="flex items-center justify-between">

                                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight mt-3 mb-5">
                                    Wallet {ind+1}
                                </h1>

                                <div className="flex space-x-8 items-center">

                                    <Link className="transition-all duration-300 hover:border-b hover:border-black font-semibold leading-none"
                                        href={`/${key.indexNo}/${key.publicKey}`}>
                                        PUMP TOKENS
                                    </Link>

                                    <Button variant={"destructive"} onClick={()=>deleteWallet(key.indexNo)}>
                                        Delete
                                    </Button>

                                </div>

                                

                            </div>

                           

                            <div className="flex flex-col gap-y-7">

                                <div className="flex flex-col gap-y-2">
                                    <p className="font-medium text-xl">Public Key</p>
                                    <p onClick={()=>copyKey(key.publicKey,"public")}
                                        className="text-lg text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-all ease-in-out">
                                        {key.publicKey}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-y-2">
                                    <p className="font-medium text-xl">Secret Key</p>
                                    <p onClick={()=>copyKey(key.secretKey,"secret")}
                                        className="font-bold text-3xl text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-all ease-in-out">
                                        {`..............................................`}
                                    </p>
                                </div>

                            </div>
                            
                        </div>
                    ))
                }
            </div>

        </div>
    )
}