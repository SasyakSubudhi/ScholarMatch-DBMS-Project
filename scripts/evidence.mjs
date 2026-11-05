import {db} from '../lib/db.mjs';import {embed} from '../lib/embedding.mjs';import fs from 'node:fs/promises';
const d=await db();const log=[];async function query(label,sql,p=[]){const r=await d.query(sql,p);log.push({label,sql,rows:r.rows});}
await query('Resulting tables',"SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
await query('Eligibility join and correlated query','SELECT scheme_id,name FROM eligible(1)');
await query('Join and aggregate','SELECT * FROM v_scheme_application_stats');
await query('Nested query','SELECT name FROM schemes WHERE max_income>(SELECT AVG(max_income) FROM schemes)');
await query('CTE','WITH eligible_count AS (SELECT COUNT(*) AS n FROM eligible(1)) SELECT * FROM eligible_count');
await query('Recursive CTE','WITH RECURSIVE years(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM years WHERE n<4) SELECT * FROM years');
await d.exec('BEGIN');
await query('DML insert',"INSERT INTO applications(user_id,scheme_id,status) VALUES(1,1,'saved') ON CONFLICT(user_id,scheme_id) DO UPDATE SET status='saved' RETURNING *");
await query('DML update and timestamp trigger',"UPDATE applications SET status='applied' WHERE user_id=1 AND scheme_id=1 RETURNING *");
await query('Vector read','SELECT scheme_id,1-(embedding <=> $1::vector) AS similarity FROM scheme_embeddings ORDER BY embedding <=> $1::vector',[JSON.stringify(embed('engineering tuition'))]);
await query('Vector update','UPDATE scheme_embeddings SET embedding=$1::vector WHERE scheme_id=1 RETURNING scheme_id',[JSON.stringify(embed('new education content'))]);
await query('Vector delete','DELETE FROM scheme_embeddings WHERE scheme_id=1 RETURNING scheme_id');
await query('DML delete','DELETE FROM applications WHERE user_id=1 AND scheme_id=1 RETURNING application_id');
await d.exec('ROLLBACK');await fs.mkdir('evidence',{recursive:true});await fs.writeFile('evidence/database-results.json',JSON.stringify(log,null,2));console.log('Executed '+log.length+' evidence queries; rollback restored state');await d.close();
