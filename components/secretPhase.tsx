import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { toast } from "sonner"

interface SecretPhase{
    list:string[]
}

export const SecretPhase = ({list}:SecretPhase) => {

    const copyPhrase = async() => {
        const text = list.join(" ");
        await navigator.clipboard.writeText(text);
        toast("Copied the Secret Phase !!");
    }

    return (
        <Accordion type="single" collapsible className="border px-7 py-3 rounded-xl">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-3xl cursor-default">
                    Secret Phase
                </AccordionTrigger>
                <AccordionContent onClick={copyPhrase} className="cursor-pointer">
                    <div className="grid grid-cols-3 gap-x-2 gap-y-2 my-5 transition-all">
                        {
                            
                            list.map((word)=>(
                                <div key={word} className="text-xl font-normal border rounded-2xl text-center py-6 bg-zinc-100 hover:bg-zinc-200 transition-all ease-in-out duration-200">
                                    {word}
                                </div>
                            ))
                            
                        }
                    </div>
                    
                    <div className="pl-1 text-xl text-gray-400 font-medium hover:text-gray-600 transition-all ease-in-out duration-200">
                        Click to Copy the Phrase 
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}