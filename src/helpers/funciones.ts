import sql from '../database';

async function leerMunicipio (idmunicipio: number) {
  let response = await sql`SELECT * FROM municipios WHERE iddep = ${idmunicipio}`;
  let municipio = response[0] as Req.Municipios;
  municipio.depto = await leerDepartamento(municipio.iddep);
}
async function leerDepartamento (iddep: number) {
  let response = await sql`SELECT * FROM departamentos WHERE iddep = ${iddep}`;
  return response[0] as Req.Depto;
}

export { leerMunicipio, leerDepartamento };