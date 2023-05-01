import { Municipio, Est } from './tipos';
export default {}

declare global {
  namespace Req {
    export interface Depto {
      nombre: string;
    }
    export interface TipoCandidatos {
      tipo: string;
    }
    export interface Municipios {
      nombre: string;
      idmunicipio: number;
      numh: number;
      depto?: Depto;
      dnombre?:string;
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
      est?: Est;
    }
    export interface Ciudadano {
      nombres: string;
      apellidos: string;
      dpi: string;
      idemp: string;
      direccion: string;
      idmunicipio?: number;
      municipio?: Municipio;
    }

    export interface Voluntarios{
      idemp: string;
      nmesa: number;
      tipo: string;
      ciudadano?: Ciudadano;
      mesa?: Mesas;

    }

    export interface Partidos{
      nombre: string;
      acronimo: string;
      logo: string;
      dpiSecretario: string;
      secretario?: Ciudadano;
    }

    export interface Candidatos{
      idemp: string;
      acronimo: string;
      casilla: string;
      tipo: string;
      idmnicipio: number;
      dnombre: string;
      ciudadanos?: Ciudadano;
      partido?: Partidos;
      tipoCandidatos?: TipoCandidatos;
      municipios?: Municipios;
      depto?: Depto;

    }

    export interface Votos{
      acronimo: string;
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
    }
    export interface TipoCandidatos {
      tipo: string;
    }
    export interface Municipios {
      nombre: string;
      idmunicipio: number;
      numh: number;
      depto?: Depto;
      dnombre?:string;
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
      est?: Est;
    }
    export interface Ciudadano {
      nombres: string;
      apellidos: string;
      dpi: string;
      idemp: string;
      direccion: string;
      idmunicipio?: number;
      municipio?: Municipio;
    }

    export interface Voluntarios{
      idemp: string;
      nmesa: number;
      tipo: string;
      ciudadano?: Ciudadano;
      mesa?: Mesas;

    }

    export interface Partidos{
      nombre: string;
      acronimo: string;
      logo: string;
      dpiSecretario: string;
      secretario?: Ciudadano;
    }

    export interface Candidatos{
      idemp: string;
      acronimo: string;
      casilla: string;
      tipo: string;
      idmnicipio: number;
      dnombre: string;
      ciudadanos?: Ciudadano;
      partido?: Partidos;
      tipoCandidatos?: TipoCandidatos;
      municipios?: Municipios;
      depto?: Depto;

    }

    export interface Votos{
      acronimo: string;
      nmesa: number;
      tipo: string;
      cantidad: number;
      partido?: Partidos;
      mesa?: Mesas;
      tipoCandidatos?: TipoCandidatos; 
    }
  }
}
