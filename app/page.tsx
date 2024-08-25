"use client";

import { Navbar } from "@/components/navbar";
import { Onboard } from "@/components/onboard";


export default function Home() {

  return (
      <div className="flex flex-col my-10 max-w-screen-2xl mx-auto py-10 px-5 space-y-10"> 
        <Navbar/>
        <Onboard/>
      </div>
  );
}
