"use client";

import { getConnection } from "@/config";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { GetProgramAccountsFilter, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { TabComponent } from "@/components/tabcomp";
import { toast } from "sonner"

export default function WalletInfoPage(){

    const params = useParams<{ index: string; key: string }>();
    const router = useRouter();
    const [SOL,setSOL] = useState(0);
    const [verified,setVerified] = useState(false);
    const [secretKey,setSecretKey] = useState<Uint8Array|null>(null);

    const [payer,setPayer] = useState<{publicKey:PublicKey, secretKey:Uint8Array}|null>(null);

    const [decimal,setDecimal] = useState(9);
    const[mintAmount,setMintAmount] = useState(10);

    const [tokenName,setTokenName] = useState("");
    const [tokenSymbol,setTokenSymbol] = useState("");
    const [tokenIPFS,setTokenIPFS]= useState("https://cdn.100xdevs.com/metadata.json");

    const [mintedAddress,setMintedAddress] = useState("");
    const [loading,setLoading] = useState(false);

    const [tokenList,setTokenList] = useState<{mintAddress:string; tokenBalance:number}[]|null>(null);


    useEffect(()=>{
        
        const seed = localStorage.getItem("seedInHex");

        if(!seed){
            router.push("/");
            return;
        }

        const countInMem = localStorage.getItem("count");
        if(!countInMem){
            router.push("/");
            return;
        }

        const countArr = countInMem.split(" ");

        const count = countArr.find((c)=> c === params.index);

        if(!count){
            router.push("/");
            return;
        }

        const path = `m/44'/501'/${count}'/0'`;
        const derivedSeed = derivePath(path,seed).key;

        const keypair = Keypair.fromSeed(derivedSeed);

        const publicKey = keypair.publicKey.toBase58();

        if(publicKey !== params.key){
            router.push("/");
            return;
        }

        setSecretKey(keypair.secretKey);
        setPayer({publicKey:keypair.publicKey,secretKey:keypair.secretKey});
        setVerified(true);

    
    },[])

    useEffect(()=>{
        if(verified){
            getSOLbalance();
            getAllTokens();
        }
    },[verified])


    const getSOLbalance = async() => {
        const connection = getConnection();
        const publicKey = new PublicKey(params.key);
        const bal = await connection.getBalance(publicKey) / LAMPORTS_PER_SOL;
        setSOL(bal);
    }

    const getAllTokens = async () => {
        const connection = getConnection();
        const filters:GetProgramAccountsFilter[] = [
            {
              dataSize: 165,    //size of account (bytes)
            },
            {
              memcmp: {
                offset: 32,     //location of our query in the account (bytes)
                bytes: params.key,  //our search criteria, a base58 encoded string
              }            
            }
         ];

        const accounts = await connection.getParsedProgramAccounts(
            new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),   //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
            {filters: filters}
        );

        console.log("FETCHED ALL THE ACCOUNTS : ");
        console.log(accounts);

        const tokenArr = accounts.map((acc)=>{
            const parsedAccountInfo:any = acc.account.data;
            const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
            const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

            return {mintAddress,tokenBalance};
        });
        setTokenList(tokenArr);

    }

    const createAndMintToken = async() => {

        if(SOL === 0){
            toast("Kindly Airdrop some Solana on Devnet to continue ! ");
            return;
        }

        if(!tokenName){
            toast("Token name is required ");
            return;
        }

        if(!tokenSymbol){
            toast("Token Symbol is required ");
            return;
        }

        setLoading(true);
        const mint = await createToken();
        if(!mint){
            console.error("Problem in minting the token");
            setLoading(false);
            return;
        }
        const mintTx = await mintToken(mint);
        console.log("Mint TX : ", mintTx);
        const metaTx = await attachMetadata(mint);
        console.log("META TX : ",metaTx);
        setMintedAddress(mint.toBase58());
        toast("Minted the Token Successfully !");
        setLoading(false);
    }

    const createToken = async() => {
        if(!payer) return;

        const connection = getConnection();
        const mintAddress = await createMint(connection,payer,payer.publicKey,payer.publicKey,decimal);
        console.log("Created Minted Address : ");
        console.log(mintAddress.toBase58());
        return mintAddress;
    }   

    const mintToken = async(mint:PublicKey) => {
        if(!payer) return;

        const connection = getConnection();
        const tokenAccount = await getOrCreateAssociatedTokenAccount(connection,payer,mint,payer.publicKey);

        const tx = await mintTo(connection, payer, mint, tokenAccount.address, payer.publicKey, mintAmount * Math.pow(10, decimal));
        return tx;
    }

    const attachMetadata = async(tokenMintAccount:PublicKey) => {

        if(!payer){
            return;
        }

        const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        );

        const metadataData = {
            name: tokenName,
            symbol: tokenSymbol,
            // Arweave / IPFS / Pinata etc link using metaplex standard for offchain data
            uri: tokenIPFS,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        };

        const metadataPDAAndBump = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            tokenMintAccount.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID,
        );
 
        const metadataPDA = metadataPDAAndBump[0];
        
        const transaction = new Transaction();
        
        const createMetadataAccountInstruction =
        createCreateMetadataAccountV3Instruction(
            {
            metadata: metadataPDA,
            mint: tokenMintAccount,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
            },
            {
            createMetadataAccountArgsV3: {
                collectionDetails: null,
                data: metadataData,
                isMutable: true,
            },
            },
        );
        
        transaction.add(createMetadataAccountInstruction);
        
        const transactionSignature = await sendAndConfirmTransaction(
        getConnection(),
        transaction,
        [payer],
        );

        console.log("TRANSACTION SIG");
        console.log(transactionSignature);
    }
    

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-y-10">
        
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                PUMP TOKENS
            </h1>


            <TabComponent
                decimal={decimal}
                setDecimal={setDecimal}
                tokenName={tokenName}
                setTokenName={setTokenName}
                tokenSymbol={tokenSymbol}
                setTokenSymbol={setTokenSymbol}
                mintAmount={mintAmount}
                setMintAmount={setMintAmount}
                tokenIPFS={tokenIPFS}
                setTokenIPFS={setTokenIPFS}
                mintedAddress={mintedAddress}
                loading={loading}
                onSubmit={createAndMintToken}
                publicKey={params.key}
                tokenList={tokenList}
                SOL={SOL}
            />  
           
        </div>
    )
}

