"use client";

import { Button } from "@/components/ui/button";
import * as bip39 from "bip39";
import {ethers} from "ethers";
import { useState } from "react";

interface List{
    publicKey:string;
    secretKey:string;
    address:string;
}

export default function Page(){

    let index = 0;

    const [list,setList] = useState<List[]>([]);

    const createMnemonic = () => {
        const mnemonic = bip39.generateMnemonic();
        return mnemonic;
    }

    const generateWallet = async() => {
        const phrase = createMnemonic();
        
        const masterWallet = ethers.HDNodeWallet.fromPhrase(phrase);

        const {address,publicKey,privateKey} = masterWallet.derivePath(index.toString());

        console.log(masterWallet);

        setList( p => [
            ...p,
            {
                address,
                publicKey,
                secretKey:privateKey,
            }
        ])

    }

    return (
        <div className="flex flex-col items-center py-10 px-20 space-y-20">
            I am ethereum 
            
            <div className="flex flex-col items-center space-y-5">
                {
                    list.map((l) => (
                        <div className="flex flex-col items-center">
                            <p>Address : {l.address}</p>
                            <p>Public Key : {l.publicKey}</p>
                            <p>Secret Key : {l.secretKey}</p>
                        </div>
                    ))
                }

            </div>

            <Button onClick={generateWallet}>
                Generate Wallet
            </Button>
        </div>
    )
}