import { NextResponse } from 'next/server';
export function ok(data:unknown,status=200){return NextResponse.json(data,{status});}
export function bad(message:string,status=400){return NextResponse.json({error:message},{status});}
export async function guard<T>(fn:()=>Promise<T>){try{return await fn()}catch(e){if(e instanceof Error&&e.message==='UNAUTHORIZED')return bad('Unauthorized',401); throw e;}}
