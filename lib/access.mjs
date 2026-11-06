// Authentication and migrations use the trusted bootstrap connection.
// Authenticated business operations always switch to a restricted SQL role.
export function scopedDatabase(database,user){
 if(!Number.isInteger(user.user_id)||!['student','admin'].includes(user.role))throw Error('Invalid database identity');
 const role=user.role==='admin'?'scholar_admin':'scholar_student';
 async function transaction(fn){return database.transaction(async tx=>{
  await tx.query("SELECT set_config('app.user_id',$1,true)",[String(user.user_id)]);
  await tx.exec('SET LOCAL ROLE '+role);
  return fn(tx);
 })}
 return {transaction,query:(sql,params=[])=>transaction(tx=>tx.query(sql,params))};
}
