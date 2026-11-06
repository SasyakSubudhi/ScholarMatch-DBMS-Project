import readline from 'node:readline';
import fs from 'node:fs/promises';
import {db} from '../lib/db.mjs';

// Use this console only after stopping all web servers using this data folder.
const database = await db();
const input = readline.createInterface({input:process.stdin,output:process.stdout,terminal:process.stdin.isTTY});
let pending = '';
console.log('ScholarMatch SQL console');
console.log('Connected to the saved application database (or DB_PATH if set).');
console.log('Stop the web application before using this console.');
console.log('End SQL with a semicolon. Commands: .tables  .schema  .quit');
function prompt(){if(process.stdin.isTTY){input.setPrompt(pending?'...> ':'sql> ');input.prompt();}}
prompt();
try {
 for await (const line of input) {
  const command=line.trim();
  if(!pending && ['.quit','.exit'].includes(command))break;
  try {
   if(!pending && command==='.tables'){
    console.table((await database.query("SELECT table_name,table_type FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")).rows);
   } else if(!pending && command==='.schema'){
    console.log(await fs.readFile('sql/schema.sql','utf8'));
   } else {
    pending+=line+'\n';
    if(command.endsWith(';')){
     const results=await database.exec(pending);
     for(const result of results){if(result.rows?.length)console.table(result.rows);else console.log('OK. Affected rows:',result.affectedRows??0);}
     pending='';
    }
   }
  }catch(error){console.error('SQL error:',error.message);pending='';}
  prompt();
 }
 if(pending.trim())console.log('Incomplete SQL discarded; finish commands with a semicolon.');
} finally {
 input.close();await database.close();console.log('Database closed. You can now run npm start.');
}
