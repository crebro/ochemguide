import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Get request body
        const { content, reactionId } = await request.json()
        // Validate input
        if (!content) {
            return new Response('Invalid input', { status: 400 })
        }

        const rendererEndpoint = process.env.NEXT_PUBLIC_LATEX_RENDERER;
        if (!rendererEndpoint) {
            return new Response('Renderer endpoint not set', { status: 500 })
        }

        console.log(content);

        const latexContent = `\\documentclass{standalone}
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

        const svgResponse = await axios.post(rendererEndpoint, latexContent, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        if (!svgResponse.data.svg) {
            return new Response('Failed to fetch SVG', { status: 500 })
        }

        const svgContnet = svgResponse.data.svg;

        const blob = new Blob([svgContnet], { type: 'image/svg+xml' });
        const buffer = await blob.arrayBuffer();

        const supabaseServerClient = await createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SERVICE_ROLE_SECRET_SUPABASE!,
        );

        const filePath = `reactions/${reactionId}.svg`.replace(/^\/+/, '');

        const {data, error} = await supabaseServerClient.storage.from("svg-storage-bucket").upload(filePath, buffer, {
            contentType: "image/svg+xml",
            upsert: true
        });

        if (error) {
            console.log(error);
            return new Response('Error uploading SVG', { status: 500 })
        }

        const {data: {publicUrl}} = supabaseServerClient.storage.from("svg-storage-bucket").getPublicUrl(filePath);

        await prisma.reaction.update({
            data: {
                publicPreviewUrl: publicUrl
            },
            where: {
                id: reactionId
            }
        });

        // return a json response
        return new Response(JSON.stringify({ svg: publicUrl }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching SVG:', error);
        return new Response('Error fetching SVG', { status: 500 })
    }
}

