import { Municipio, Est } from './response';
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
      numH: number;
      depto?: Depto;
    }

    export interface Establecimientos {
      idest: number;
      nombre: string;
      direccion: string;
      municipio?: Municipio;
    }

    export interface Mesas {
      nmesa: number;
      cotaSuperior: number;
      cotaInferior: number;
      est?: Est;
    }
    export interface Ciudadano {
      nombres: string;
      apellidos: string;
      dpi: string;
      idemp: string;
      direccion: string;
      municipio?: Municipio;
    }

    export interface Partidos{
      nombre: string;
      acronimo: string;
      logo: string;
      secretario?: Ciudadano;
    }

    export interface Candidatos{
      casilla: string;
      ciudadanos?: Ciudadano;
      partido?: Partidos;
      tipoCandidatos?: TipoCandidatos;
      municipios?: Municipios;
      depto?: Depto;

    }

    export interface Votos{
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
      numH: number;
      depto?: Depto;
    }

    export interface Establecimientos {
      idest: number;
      nombre: string;
      direccion: string;
      municipio?: Municipio;
    }

    export interface Mesas {
      nmesa: number;
      cotaSuperior: number;
      cotaInferior: number;
      est?: Est;
    }
    export interface Ciudadano {
      nombres: string;
      apellidos: string;
      dpi: string;
      idemp: string;
      direccion: string;
      municipio?: Municipio;
    }

    export interface Partidos{
      nombre: string;
      acronimo: string;
      logo: string;
      secretario?: Ciudadano;
    }

    export interface Candidatos{
      casilla: string;
      ciudadanos?: Ciudadano;
      partido?: Partidos;
      tipoCandidatos?: TipoCandidatos;
      municipios?: Municipios;
      depto?: Depto;

    }

    export interface Votos{
      cantidad: number;
      partido?: Partidos;
      mesa?: Mesas;
      tipoCandidatos?: TipoCandidatos; 
    }
  }
}
