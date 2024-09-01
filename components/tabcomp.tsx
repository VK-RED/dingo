"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";


export interface TabProps{
    className?:string;

    loading:boolean;
    SOL:number;

    tokenName:string;
    decimal:number;
    mintAmount:number;
    tokenSymbol:string;
    tokenIPFS:string;
    mintedAddress: string;
    publicKey:string

    setDecimal:Dispatch<SetStateAction<number>>;
    setTokenName:Dispatch<SetStateAction<string>>;
    setMintAmount:Dispatch<SetStateAction<number>>;
    setTokenSymbol: Dispatch<SetStateAction<string>>;
    setTokenIPFS: Dispatch<SetStateAction<string>>;

    tokenList: {
        mintAddress: string;
        tokenBalance: number;
    }[] | null

    onSubmit: () => Promise<void>;

}

export function TabComponent({className,tokenName,decimal,mintAmount,tokenSymbol,tokenIPFS,setDecimal,setMintAmount,setTokenIPFS,setTokenName,setTokenSymbol, onSubmit, mintedAddress, loading, publicKey, SOL, tokenList}:TabProps) {
    return (
      <Tabs defaultValue="pump" className={`w-[600px] ${className}`}>

        <TabsList className="grid w-full grid-cols-2">

            <TabsTrigger value="pump">{mintedAddress?"Minted Address":"Create Tokens"}</TabsTrigger>
            <TabsTrigger value="account">Account Overview</TabsTrigger>
          
        </TabsList>

        <TabsContent value="pump">

          {!mintedAddress  ? <Card className="shadow-2xl">
            
            <CardHeader>
              <CardTitle>Create Tokens</CardTitle>
              <CardDescription>
                Create your own tokens and Revolutionize the world 
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">

              <div className="space-y-1">
                <Label htmlFor="tokenName">Token Name</Label>
                <Input id="tokenName" type="text" value={tokenName} onChange={(e)=>setTokenName(e.target.value)}/>
              </div>

              <div className="space-y-1">
                <Label htmlFor="Symbol">Symbol</Label>
                <Input id="Symbol" type="text" value={tokenSymbol} onChange={(e)=>setTokenSymbol(e.target.value)}/>
              </div>

              <div className="space-y-1">
                <Label htmlFor="ipfsUri">IPFS URI</Label>
                <Input id="ipfsUri" type="text" value={tokenIPFS} onChange={(e)=>setTokenIPFS(e.target.value)}/>
              </div>

              <div className="space-y-1">
                <Label htmlFor="mintLimit">Token Limit</Label>
                <Input id="mintLimit" type="number" value={mintAmount} onChange={(e)=>setMintAmount(Number(e.target.value))}/>
              </div>

              <div className="space-y-1">
                <Label htmlFor="mintDecimal">Decimals</Label>
                <Input id="mintDecimal" type="number" value={decimal} onChange={(e)=>setDecimal(Number(e.target.value))}/>
              </div>


            </CardContent>

            <CardFooter>
                <Button disabled={loading}
                    onClick={onSubmit}>
                        {loading && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        )}
                    Pump it
                </Button>
            </CardFooter>

          </Card> : <Card className="shadow-2xl">
            
            
          <CardHeader>
              <CardTitle>Minted Token</CardTitle>
              <CardDescription>
                Address of the Minted Token 
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 flex flex-col">

              <div className="space-y-1">
                {mintedAddress}
              </div>

             
                <Link className="text-sm text-slate-400 hover:text-slate-800 transition-all duration-300"
                    href={`https://explorer.solana.com/address/${mintedAddress}?cluster=devnet`}
                    target="_blank" rel="noopener noreferrer"
                    >
                    Explore it on Solana Explorer
                </Link>
              

            </CardContent>
            
            </Card>}
        </TabsContent>

        <TabsContent value="account">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Create your own tokens and Revolutionize the world 
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

                <div className="flex flex-col gap-y-1">

                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Balance
                    </h3>

                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        {SOL} SOL
                    </h4>

                </div>

                <div className="flex flex-col gap-y-3">
                    {
                        tokenList?.map((token)=> (
                            <div key={token.mintAddress} className="flex flex-col gap-y-3 border rounded-xl px-5 py-4 bg-gray-50">

                                <div className="flex flex-col gap-y-2">
                                    <div 
                                        className="scroll-m-20 text-xl font-semibold tracking-tight">
                                        Token Address
                                    </div>
                                    <Link 
                                        className="text-lg leading-none text-slate-500 hover:text-slate-800 transition-all duration-300"
                                        href={`https://explorer.solana.com/address/${token.mintAddress}?cluster=devnet`}
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {token.mintAddress}
                                    </Link>

                                </div>

                                <div className="flex flex-col gap-y-2">
                                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                        Token Balance
                                    </h4>
                                    <small className="text-lg leading-none">{token.tokenBalance}</small>

                                </div>
                               
                            </div>
                        ))
                    }
                </div>
                
                

                


            </CardContent>
            

          </Card>
        </TabsContent>

      </Tabs>
    )
  }