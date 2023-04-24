export default {}

declare global {
  namespace Response {

  }
  namespace Request {
    export interface Depto {
      nombre: string;
    }
    export interface Municipio {
      nombre: string;
      numH: number;
      idmunicipio: number;
      dept: Depto;
    }
    export interface Est {
      idest: number;
      nombre: string;
      direccion: string;
      ubicacion: Municipio;
    }
    export interface Mesa {
      nmesa: number;
      cotaS: number;
      cotaI: number;
      est?: Est;
      voluntarios: Voluntario[];
    }
    export interface Voluntario extends Ciudadano {
      tipo: string;
    }
    export interface Ciudadano {
      nombres: string;
      dpi: string;
      apellidos?: string; // | "tipo" (para agregar otro tipo) ?: (para agregar que puede ser tipo nulo)
      idemp: number
      municipio: Municipio;
    }
    export interface Partido {
      nombre: string;
      acronimo: string;
      logo: string;
      secretario: Ciudadano;
    }
    export interface Candidato extends Ciudadano {
      tipo: string;
      casilla?: number;
      municipio?: Municipio;
    }
  }
}
