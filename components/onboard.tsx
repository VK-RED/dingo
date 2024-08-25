"use client";

import { useEffect, useState } from "react";
import { SecretPhase } from "./secretPhase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as bip39 from "bip39";
import * as bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Wallets } from "./wallets";
import { toast } from "sonner"


interface Keys{
    publicKey:string;
    secretKey:string;
    indexNo:string
}

export const Onboard = () => {

    const [words,setWords] = useState<string[]>([]);
    const [pairs,setPairs] = useState<Keys[]>([]);
    const [isImport,setIsImport] = useState(false);
    const [inputPhrase,setInputPhrase] = useState("");

    useEffect(()=>{
        loadInitialData();
    },[])

    const loadInitialData = () => {
        const seedInHex = localStorage.getItem("seedInHex");
        const mnemonic  = localStorage.getItem("secret");

        if(seedInHex && mnemonic){
            const countsArr = localStorage.getItem("count")?.split(" ") || ["0"];

            for(const count of countsArr){
                const path = `m/44'/501'/${count}'/0'`;
                const derivedSeed = derivePath(path,seedInHex).key;

                const keypair = Keypair.fromSeed(derivedSeed);

                const publicKey = keypair.publicKey.toBase58();
                const secretKey = bs58.encode(keypair.secretKey);

                setPairs( p => [
                    ...p,
                    {
                        publicKey,
                        secretKey,
                        indexNo:count
                    }
                ])
            }

            setWords(mnemonic.split(" "));
        }
    }

    const generateKeyPair = async(seedInHex:string, lastCount:number) => {

        const count = lastCount+1;
        const path = `m/44'/501'/${count}'/0'`;
        const derivedSeed = derivePath(path,seedInHex).key;

        const keypair = Keypair.fromSeed(derivedSeed);

        const publicKey = keypair.publicKey.toBase58();
        const secretKey = bs58.encode(keypair.secretKey);

        setPairs((p) => [
            ...p,
            {
                publicKey,
                secretKey,
                indexNo:count.toString()
            }
        ])

        const counts = localStorage.getItem("count");

        if(counts){
            const countArr = counts.split(" ");
            countArr.push(count.toString());
            localStorage.setItem("count",countArr.join(" "));
        }
        else{
            const countArr = [count.toString()];
            localStorage.setItem("count",countArr.join(" "));
        }
    }

    const generateWallet = async() => {
       
        let seedInHex = localStorage.getItem("seedInHex");

        if(!seedInHex){
            const mnemonic = bip39.generateMnemonic();
            const seed = bip39.mnemonicToSeedSync(mnemonic,""); 
            seedInHex = seed.toString("hex")
            const count = 0;

            localStorage.setItem("secret",mnemonic);
            localStorage.setItem("count",count.toString());
            localStorage.setItem("seedInHex",seedInHex);

            setWords(mnemonic.split(" "));
        }

        let counts = localStorage.getItem("count");
        let lastCount = -1;

        if(counts){
            const countArr = counts.split(" ");
            const n = countArr.length;
            lastCount = Number(countArr[n-1]);
        }    

        await generateKeyPair(seedInHex,lastCount);

    }

    const clearWallet = () => {
        localStorage.clear();
        setPairs([]);
        setWords([]);
    }

    const handleImport = () => {
        setIsImport(true);
    }

    const generateWalletFromSeed = async()=>{

        if(!bip39.validateMnemonic(inputPhrase)){
            toast("Enter Valid Seed Phrase !");
            return;
        }

        const seed = bip39.mnemonicToSeedSync(inputPhrase,""); 
        const seedInHex = seed.toString("hex")
        
        localStorage.setItem("secret",inputPhrase);
        localStorage.setItem("seedInHex",seedInHex);

        await generateWallet();
        setWords(inputPhrase.split(" "));
        setIsImport(false);
        setInputPhrase("");

    }

    return (
        <div className="flex flex-col space-y-10 relative">

            <div className="flex w-full items-center justify-between">

                {!isImport && <div className="flex items-center space-x-2">
                    <Button type="button" onClick={generateWallet}>Add Wallet</Button>
                    {
                        words.length === 0 &&  
                        <Button onClick={handleImport} type="button">Import Wallet</Button>
                    }
                </div>}

                {
                    words.length > 0 &&

                    <Button variant={"destructive"} onClick={clearWallet}>
                        Remove Wallet
                    </Button>
                }
 
            </div>

            {
                isImport &&

                <div className="flex w-full items-center space-x-2 absolute top-[-50px]">

                    <Input value={inputPhrase} onChange={(e)=>setInputPhrase(e.target.value)}
                        className="h-12 text-lg font-light tracking-tight"
                        type="text" placeholder="Enter Seed phrase separated by spaces" />
                    <Button className="h-12"
                         onClick={generateWalletFromSeed} type="button">Generate Wallet</Button>
                </div>
            }

            {
                words.length > 0 && <SecretPhase list={words} />
            }

            {
                pairs.length > 0 &&
                <Wallets keysList={pairs} setPairs={setPairs}/>
            }
            
        </div>
    )
}