export class Persona {
  id!: string;
  nombre!: string;
  apellido!: string;
  dni!: string;
  telefono!: string;
  provincia!: string;
  departamento_id!: string;
  localidad_id!: string;
  localidad_nombre?: string; // Añadir esta propiedad
  codigoPostal!: string;
  domicilio!: string;
  fechaNacimiento!: Date;
  sexo!: string;
  edad!: number;

  constructor() {
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.telefono = '';
    this.provincia = '';
    this.departamento_id = '';
    this.localidad_id = '';
    this.codigoPostal = '';
    this.domicilio = '';
    this.fechaNacimiento = new Date();
    this.sexo = '';
    this.edad = 0;
  }
}