import postgres from "postgres";

const password = process.env.PASSWORD ? process.env.PASSWORD : 'gabyss22';
const sql = postgres(`postgres://postgres:${password}@host:5432/ccv`,{
  host:'localhost',
  port: 5432,
  database:'ccv',
  username:'postgres',
  password,
});

export default sql;
