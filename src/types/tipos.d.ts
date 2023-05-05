import { Municipio, Est } from './tipos';
export default {}

declare global {
  namespace Req {
    export interface Depto {
      nombre: string;
      iddep: number;
    }
    export interface TipoCandidatos {
      tipo: string;
    }
    export interface Municipios {
      nombre: string;
      idmunicipio: number;
      numh: number;
      iddep: number;
      depto?: Depto;
    }

    export interface Establecimientos {
      idest: number;
      nombre: string;
      direccion: string;
      idmunicipio?: number;
      municipio?: Municipio;
    }

    export interface Mesas {
      nmesa: number;
      cotaSuperior: number;
      cotaInferior: number;
      idest: number;
      idmesa: number
      est?: Est;
    }
    export interface Ciudadano {
      nombres: string;
      apellidos: string;
      dpi: string;
      idemp: number;
      idmunicipio?: number;
      direccion: string;
      municipio?: Municipio;
    }

    export interface Partidos{
      nombre: string;
      acronimo: string;
      logo: string;
      idpartido: number;
      idemp: number;
      secretario?: Ciudadano;
    }

    export interface Voluntarios{
      idemp: number;
      nmesa: number;
      tipo: string;
      ciudadano?: Ciudadano;
      mesa?: Mesas;

    }

    export interface Candidatos{
      idemp: number;
      idpartido: number;
      casilla: number;
      tipo: string;
      idmnicipio: number;
      iddep: number;
      ciudadanos?: Ciudadano;
      partido?: Partidos;
      tipoCandidatos?: TipoCandidatos;
      municipios?: Municipios;
      depto?: Depto;

    }

    export interface Votos{
      idpartido: number;
      nmesa: number;
      tipo: string;
      cantidad: number;
      partido?: Partidos;
      mesa?: Mesas;
      tipoCandidatos?: TipoCandidatos; 
    }
  }
  namespace Res {
    export interface Depto {
      nombre: string;
      iddep: number;
    }
    export interface TipoCandidatos {
      tipo: string;
    }
    export interface Municipios {
      nombre: string;
      idmunicipio: number;
      numh: number;
      iddep: number;
      depto?: Depto;
    }

    export interface Establecimientos {
      idest: number;
      nombre: string;
      direccion: string;
      idmunicipio?: number;
      municipio?: Municipio;
    }

    export interface Mesas {
      nmesa: number;
      cotaSuperior: number;
      cotaInferior: number;
      idest: number;
      idmesa: number
      est?: Est;
    }
    export interface Ciudadano {
      nombres: string;
      apellidos: string;
      dpi: string;
      idemp: number;
      idmunicipio?: number;
      direccion: string;
      municipio?: Municipio;
    }

    export interface Partidos{
      nombre: string;
      acronimo: string;
      logo: string;
      idpartido: number;
      idemp: number;
      secretario?: Ciudadano;
    }

    export interface Voluntarios{
      idemp: number;
      nmesa: number;
      tipo: string;
      ciudadano?: Ciudadano;
      mesa?: Mesas;

    }

    export interface Candidatos{
      idemp: number;
      idpartido: number;
      casilla: number;
      tipo: string;
      idmnicipio: number;
      iddep: number;
      ciudadanos?: Ciudadano;
      partido?: Partidos;
      tipoCandidatos?: TipoCandidatos;
      municipios?: Municipios;
      depto?: Depto;

    }

    export interface Votos{
      idpartido: number;
      nmesa: number;
      tipo: string;
      cantidad: number;
      partido?: Partidos;
      mesa?: Mesas;
      tipoCandidatos?: TipoCandidatos; 
    }
  }
}
