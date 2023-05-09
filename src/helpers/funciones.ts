import sql from '../database';

async function leerMunicipio (idmunicipio: number) {
  let response = await sql`SELECT * FROM municipios WHERE idmunicipio = ${idmunicipio}`;
  let municipio = response[0] as Req.Municipios;
  municipio.depto = await leerDepartamento(municipio.iddep);
  return municipio;
}
async function leerDepartamento (iddep: number) {
  let response = await sql`SELECT * FROM departamentos WHERE iddep = ${iddep}`;
  return response[0] as Req.Depto;
}

async function leerEstablecimiento (idest: number) {
  let response = await sql`SELECT * FROM establecimientos WHERE idest = ${idest}`;
  let establecimiento = response[0] as Req.Establecimientos;
  establecimiento.municipio = await leerMunicipio(establecimiento.idmunicipio);
  return response[0] as Req.Establecimientos;
}

async function leerCiudadano (idemp: number) {
  let response = await sql`SELECT * FROM ciudadanos WHERE idemp = ${idemp}`;
  let ciudadano = response[0] as Req.Ciudadano;
  ciudadano.municipio = await leerMunicipio(ciudadano.idmunicipio);
  return response[0] as Req.Ciudadano;
}

async function leerMesa (idmesa: number) {
  let response = await sql`SELECT * FROM mesas WHERE idmesa = ${idmesa}`;
  let mesa = response[0] as Req.Mesas;
  mesa.est = await leerEstablecimiento(mesa.idest);
  return response[0] as Req.Mesas;
}

async function leerTipoCandidato(tipo: string) {
  let response = await sql`SELECT * FROM tipos_candidatos WHERE tipo = ${tipo}`;
  return response[0] as Req.TipoCandidatos;
}

async function leerPartido(idpartido: number) {
  let response = await sql`SELECT * FROM partidos WHERE idpartido = ${idpartido}`;
  let partido = response[0] as Req.Partidos;
  partido.secretario = await leerCiudadano(partido.idemp);
  return partido;
}


export { leerMunicipio, leerDepartamento, leerEstablecimiento, leerCiudadano, leerMesa, leerTipoCandidato, leerPartido };