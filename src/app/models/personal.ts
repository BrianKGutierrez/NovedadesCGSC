import { Dependencia } from './dependencia';
import { Persona } from './persona';

export class Personal {
  id!: string;
  legajo: string;
  escalafon: string;
  jerarquia: string;
  fechaIngreso: Date;
  funcionario: boolean;
  cargo: string;
  jefe: boolean;
  dependencia: Dependencia;
  persona: Persona;

  constructor() {
    this.legajo = "";
    this.escalafon = "";
    this.jerarquia = "";
    this.fechaIngreso = new Date();
    this.funcionario = false;
    this.cargo = "";
    this.jefe = false;
    this.dependencia = new Dependencia();
    this.persona = new Persona();
  }
}