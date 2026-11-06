import {db} from '../../../lib/db.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request){
 const origin=request.headers.get('origin');
 let sameOrigin=false;
 try{const source=new URL(origin);sameOrigin=source.host===request.headers.get('host')&&source.protocol===new URL(request.url).protocol}catch{}
 if(!sameOrigin)return Response.json({error:'Open the SQL console from this application.'},{status:403});
 const d=await db();
 const token=request.headers.get('cookie')?.match(/scholar_session=([a-f0-9]+)/)?.[1];
 const user=token?(await d.query('SELECT u.user_id,u.role FROM sessions s JOIN users u USING(user_id) WHERE s.token=$1 AND s.expires_at>NOW()',[token])).rows[0]:null;
 if(!user)return Response.json({error:'Sign in first.'},{status:401});
 if(user.role!=='admin')return Response.json({error:'Admin role required.'},{status:403});
 let body;try{body=await request.json()}catch{return Response.json({error:'Invalid request.'},{status:400})}
 if(typeof body.sql!=='string'||!body.sql.trim()||body.sql.length>20000||typeof body.preview!=='boolean')return Response.json({error:'Enter one SQL statement (up to 20000 characters).'},{status:400});
 // Each request is one prepared statement in its own transaction. Users cannot
 // leave a transaction open across HTTP requests or commit outside the wrapper.
 const first=body.sql.replace(/\/\*[\s\S]*?\*\//g,' ').replace(/--[^\n]*/g,' ').trim();
 if(/^(BEGIN|START|COMMIT|END|ROLLBACK|ABORT|SAVEPOINT|RELEASE|PREPARE)\b/i.test(first))return Response.json({error:'Use Preview to roll back, or uncheck Preview to save. Transaction commands are managed automatically.'},{status:400});
 let result;const rollback=Symbol('preview');
 try{
  try{await d.transaction(async tx=>{
   await tx.query('SELECT require_admin($1)',[user.user_id]);
   await tx.query("SET LOCAL statement_timeout = '5s'");
   const r=await tx.query(body.sql);
   result={rows:r.rows.slice(0,500),fields:r.fields,affectedRows:r.affectedRows??0,totalRows:r.rows.length,preview:body.preview};
   if(body.preview)throw rollback;
  })}catch(error){if(error!==rollback)throw error}
  return Response.json(result);
 }catch(error){return Response.json({error:error.message},{status:400})}
}
