import postgres from "postgres";
const sql = postgres("postgres://postgres:gabyss22@host:5432/ccv",{
  host:'localhost',
  port: 5432,
  database:'ccv',
  username:'postgres',
  password:'gabyss22',

})
export default sql;