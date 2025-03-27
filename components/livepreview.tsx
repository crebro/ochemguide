"use client";
import { useState, useRef } from 'react';
import axios from 'axios';
import { useDebounceCallback } from 'usehooks-ts';

function LivePreview() {
  const [title, setTitle] = useState<string>("Hell Vollhard Zelinsky");
  const [svg, setSVG] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchContent = async () => {
    console.log("happening");
    if (!textareaRef.current) {
      return;
    }
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
      ${textareaRef.current.value}
      }
      \\end{document} 
      `;
    const response = await axios.post("http://localhost:8080", fullRequest, { headers: { 'Content-Type': "text/plain" } });
    if (response.data.svg) {
      setSVG(response.data.svg);
    }
  }

  const debouncedFetch = useDebounceCallback(fetchContent, 2000);

  return (
    <main className="flex flex-col items-center gap-[32px] row-start-2 mx-auto justify-between min-h-full">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{title}</h1>
        <div id="reaction-item" dangerouslySetInnerHTML={{ __html: svg }}></div>
      </div>

      <div className='flex flex-col w-100 items-center'>
        <input onChange={(v) => setTitle(v.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4" defaultValue={title} />
        <pre className='mb-2'>
          <code>
            \documentclass{"{standalone}"}<br />
            \usepackage{"{chemfig}"}<br />
            \begin{"{document}"}
          </code>
        </pre>
        <textarea
          id="message"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Begin authoring your chemical reaction."
          ref={textareaRef}
          onChange={debouncedFetch}
          defaultValue={""}
        />
        <pre className='mt-2'>
          <code>
            \end{"{document}"}<br />
          </code>
        </pre>

      </div>

    </main>
  )
}

export default LivePreview