import "@/app/livepreview.css"
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Home() {
    const reaction = await prisma.reaction.findFirst();

    if (!reaction) {
        return (
            <div>
                No reactions found.
            </div>
        );
    }


    redirect(`/reaction/${reaction.id}`);
    return (
        <div>
            Redirecting to first reaction...
        </div>
    );
}