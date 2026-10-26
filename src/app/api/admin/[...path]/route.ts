import { ApiError, handleApi } from "@/lib/admin/server";
export const runtime="nodejs";
async function handler(request:Request,context:{params:Promise<{path:string[]}>}) {
  try { return await handleApi(request,(await context.params).path); }
  catch(error){return Response.json({error:error instanceof ApiError?error.message:"INVALID_REQUEST"},{status:error instanceof ApiError?error.status:400,headers:{"Cache-Control":"no-store"}});}
}
export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
