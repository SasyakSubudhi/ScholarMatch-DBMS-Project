import {db} from '../lib/db.mjs';import {scopedDatabase} from '../lib/access.mjs';import fs from 'node:fs/promises';
const d=await db(),logs=[];
for(const user of [{user_id:1,role:'student'},{user_id:2,role:'admin'}]){
 const s=scopedDatabase(d,user);
 for(const sql of ['SELECT current_user AS database_role','SELECT user_id,course,cgpa FROM student_profiles','SELECT rolname,rolsuper,rolcreaterole,rolcanlogin FROM pg_roles WHERE rolname LIKE \'scholar_%\'','UPDATE schemes SET max_income=max_income WHERE scheme_id=1 RETURNING scheme_id']){
  try{const r=await s.query(sql);logs.push({role:user.role,sql,rows:r.rows})}catch(e){logs.push({role:user.role,sql,error:e.message})}
 }
}
await fs.writeFile('evidence/database-roles.json',JSON.stringify(logs,null,2));console.log('Database permission evidence saved');await d.close();
