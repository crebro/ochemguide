"use client"
import { useEffect, useState } from 'react'
import "@/app/livepreview.css"
import axios from 'axios';
import { Prisma, Reaction } from '@prisma/client';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ViewReaction({
    reaction, followingReactions, alternativeReactions
}: {
    reaction: Reaction | null,
    followingReactions: {
        id: string,
        name: string
    }[],
    alternativeReactions: {
        id: string,
        name: string
    }[]
}) {
    const [svg, setSVG] = useState<string>("");

    const fetchContent = async (content: string) => {
        const fullRequest = `
        \\documentclass{standalone}
        \\usepackage{chemfig}
        \\usepackage{graphicx}
        \\usepackage[version=4,arrows=pgf-filled,
        textfontname=sffamily,
        mathfontname=mathsf]{mhchem}


        \\ExplSyntaxOn
        \\keys_define:nn { mhchem }
        {
        arrow-min-length .code:n =
        \\cs_set:Npn \\__mhchem_arrow_options_minLength:n { {#1} } % default is 2em
        }
        \\ExplSyntaxOff

        \\begin{document}

        \\scalebox{1.5}{
        ${content}
        }
        \\end{document} 
        `;
        const responsePromise = axios.post("http://localhost:8080", fullRequest, { headers: { 'Content-Type': "text/plain" } });
        const response = await toast.promise(responsePromise, {
            loading: 'Loading...',
            success: 'SVG loaded',
            error: 'Failed to load SVG'
        });
        if (response.data.svg) {
            setSVG(response.data.svg);
        }
    }

    useEffect(() => {
        if (reaction && !svg) {
            fetchContent(reaction.content);
        }
    }, []);

    return (
        <div className="flex min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col items-center gap-[32px] row-start-2 mx-auto justify-between min-h-full">
                <div className='flex flex-col h-full justify-center duration-500'>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{reaction?.name}</h1>
                    <div className='duration-500' id="reaction-item" dangerouslySetInnerHTML={{ __html: svg }}></div>
                </div>
            </main>
            <div className='absolute h-[100vh] left-0 top-0 flex flex-col justify-start items-start p-20'>
                {
                    alternativeReactions.length != 0 ? alternativeReactions.map((reaction) => (
                        <Link href={`/reaction/${reaction.id}`} key={reaction.id}>
                            <div key={reaction.id} className='bg-white text-black text-sm px-2 py-1 rounded-lg my-1 hover:scale-120 cursor-pointer w-fit duration-75'>
                                {reaction.name}
                            </div>
                        </Link>
                    )) : <div className='text-white'> No preceeding reactions </div>
                }
            </div>
            <div className='absolute h-[100vh] right-0 bottom-0 flex flex-col justify-end items-end p-20'>
                {
                    followingReactions.length != 0 ? followingReactions.map((reaction) => (
                        <Link href={`/reaction/${reaction.id}`} key={reaction.id}>
                            <div key={reaction.id} className='bg-white text-black text-sm px-2 py-1 rounded-lg my-1 hover:scale-120 cursor-pointer w-fit duration-75'>
                                {reaction.name}
                            </div>
                        </Link>
                    )) : <div className='text-white'> No following reactions </div>
                }
            </div>
        </div>
    );
}