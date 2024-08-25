"use client";

import { Wallet as WalletIcon } from "lucide-react";

export const Navbar = () => {

    return (

        <div className="flex flex-col">

            <div className="flex items-center space-x-3">
                <WalletIcon height={54} width={54}/>

                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                    Dingo
                </h1>
            </div>
            

            <h2 className="mt-7 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Create your SOL wallet in seconds 
            </h2>

            <p className="text-xl text-muted-foreground">
                {`Support For Ethereum Coming Soon !`}
            </p>
        </div>
        
    )
}