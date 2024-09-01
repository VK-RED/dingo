"use client";

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import * as bs58 from "bs58";
import nacl from 'tweetnacl';

export default function SolanaBalance(){
    const {address} = useParams<{ address: string }>();
    const [SOL,setSOL] = useState(0);

    useEffect(()=>{
        
    },[]);

    const sendSol = async (sol:number) => { 

        const url = process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string;

        const connection  = new Connection( clusterApiUrl('devnet'), 'confirmed');


        // for now assume that the private key is stored in localstorage ..

        const privateKey = "6FEifGtuUcoD75gVTSS4imT4iPxCgLC23eGrsiZxM4UNUJhZAUxguN6PVFTDkix4qyg3uKggiF7JkUnbF91yp9d";
        const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
        

        const sendAutoTransfer = async () => {

            const transaction = new Transaction();
    
            const transferInstruction = SystemProgram.transfer({
                fromPubkey:keypair.publicKey,
                toPubkey:new PublicKey(bs58.decode("GsbX55mbbhotPDD5SKLJf4GqWhnxNNsHunhZHx5boJop")),
                lamports:sol*LAMPORTS_PER_SOL,
            });

            transaction.add(transferInstruction);

            const res = await sendAndConfirmTransaction(connection,transaction,[{secretKey:keypair.secretKey, publicKey:keypair.publicKey}]);
            console.log(res);
        }

        await sendAutoTransfer();
        
    }

    const sendSolManual = (sol:number) => {

    }


    const retrieveBalance = async ()=>{
        const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || ""
        const res = await fetch(SOLANA_RPC_URL, {
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                "jsonrpc": "2.0", 
                "id": 1,
                "method": "getBalance",
                "params": [
                  `${address}`
                ]
            })
        });

        const data = await res.json();
        setSOL((p) => data.result.value/LAMPORTS_PER_SOL)
    }

    return (
        <div>
            <p>THE ADDRESS </p>
            <p>{address}</p>
            <p>BALANCE : {SOL}</p>
            <button onClick={()=>sendSol(0.00001)}>SEND SOL</button>
        </div>
    )
}