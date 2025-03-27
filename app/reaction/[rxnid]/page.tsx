import ViewReaction from '@/components/viewreaction';
import prisma from '@/lib/prisma';
import {redirect} from "next/navigation";
import React from 'react'

export default async function ReactionPage({
    params
}: {
    params: Promise<{ rxnid: string }>
}) {
    const {rxnid} = await params;
    const reaction = await prisma.reaction.findUnique({
        where: {
            id: rxnid
        },
        include: {
            FunctionalGroupRelation: {
                where: {
                    reactionId: rxnid,
                }
            }
        }
    });

    const alternativeReactions = await prisma.reaction.findMany({
        where: {
            FunctionalGroupRelation: {
                some: {
                    functionalGroupId: {
                        in: reaction?.FunctionalGroupRelation.filter((fgr) => fgr.relationType === "REACTANT").map((fgr) => fgr.functionalGroupId)
                    },
                    relationType: "PRODUCT"
                }
            }
        },
        select: {
            id: true,
            name: true
        }
    });

    const followingReactions = await prisma.reaction.findMany({
        where: {
            FunctionalGroupRelation: {
                some: {
functionalGroupId: {
                        in: reaction?.FunctionalGroupRelation.filter((fgr) => fgr.relationType === "PRODUCT").map((fgr) => fgr.functionalGroupId)
                    },
                    relationType: "REACTANT"
                }
            }
        },
        select: {
            id: true,
            name: true
        }
    });

    console.log(followingReactions);

    if (!reaction) {
        redirect("/error");
    }
    
    return (
        <div>
            <ViewReaction reaction={reaction} followingReactions={followingReactions} alternativeReactions={alternativeReactions}/>
        </div>
    )
}
