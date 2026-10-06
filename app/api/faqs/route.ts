import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma'; import { requireAdmin } from '@/lib/auth'; import { bad,ok } from '@/lib/api';
export async function GET(){try{await requireAdmin();return ok(await prisma.fAQ.findMany({orderBy:{sortOrder:'asc'}}))}catch{return bad('Unauthorized',401)}}
export async function POST(req:NextRequest){try{await requireAdmin();const b=await req.json();const item=await prisma.fAQ.create({data:{question: b.question, answer: b.answer, published: b.published ?? true, sortOrder: Number(b.sortOrder ?? 0)}});return ok(item,201)}catch(e){return bad(e instanceof Error?e.message:'Request failed',400)}}
