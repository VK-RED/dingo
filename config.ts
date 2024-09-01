import { clusterApiUrl, Connection } from "@solana/web3.js"

export const getConnection = () => {
    return new Connection(clusterApiUrl("devnet"));
}