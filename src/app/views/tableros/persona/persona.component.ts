import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../../services/persona.service';
import { DepartamentoService } from '../../../services/departamento.service';
import { LocalidadService } from '../../../services/localidad.service';
import { Persona } from '../../../models/persona';
import { Departamento } from '../../../models/departamento';
import { Localidad } from '../../../models/localidad';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    CommonModule, // Importa CommonModule
    FormsModule   // Importa FormsModule
  ],
  templateUrl: './persona.component.html',
})
export class PersonaComponent implements OnInit {
  personas: Persona[] = [];
  departamentos: Departamento[] = [];
  localidades: Localidad[] = [];
  selectedPersona: Persona = new Persona();
  searchDni: string = ''; // Definir la propiedad searchDni

  constructor(
    private personaService: PersonaService,
    private departamentoService: DepartamentoService,
    private localidadService: LocalidadService
  ) {}

  ngOnInit(): void {
    this.getPersonas();
    this.getDepartamentos();
  }


  getPersonas(): void {
    this.personaService.getPersonas().subscribe(
      data => {
        this.personas = data;
        // Para cada persona, actualizamos su localidad_nombre basado en el localidad_id
        this.personas.forEach(persona => {
          if (persona.localidad_id) {
            this.updateLocalidadNombre(persona);
          } else {
            persona.localidad_nombre = 'Desconocido'; // Si no tiene localidad_id
          }
        });
      },
      error => {
        console.error('Error al obtener las personas', error);
      }
    );
  }

  getDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error al obtener los departamentos', error);
      }
    );
  }

  getLocalidades(departamentoId: string): void {
    this.localidadService.getLocalidadesByDepartamento(departamentoId).subscribe(
      data => {
        this.localidades = data;
        console.log('Localidades cargadas:', this.localidades); // Verificar los datos cargados
      },
      error => {
        console.error('Error al obtener las localidades', error);
      }
    );
  }

  getDepartamentoNombre(departamentoId: string): string {
    const departamento = this.departamentos.find(dep => dep.id === departamentoId);
    return departamento ? departamento.nombre : 'Desconocido';
  }

  updateLocalidadNombre(persona: Persona): void {
    this.localidadService.getLocalidadById(persona.localidad_id).subscribe(
      localidad => {
        persona.localidad_nombre = localidad.nombre; // Asignamos el nombre de la localidad
      },
      error => {
        console.error('Error al obtener la localidad:', error);
        persona.localidad_nombre = 'Desconocido'; // En caso de error
      }
    );
  }
  

  addPersona(): void {
    if (!this.selectedPersona.nombre || !this.selectedPersona.apellido || !this.selectedPersona.dni) {
      Swal.fire('Formulario incompleto', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    this.personaService.createPersona(this.selectedPersona).subscribe(
      res => {
        console.log('Persona creada', res);
        this.getPersonas();
        this.selectedPersona = new Persona();
        Swal.fire('Éxito', 'Persona guardada con éxito', 'success');
      },
      error => {
        console.error('Error al crear persona', error);
        Swal.fire('Error', 'Error al crear la persona', 'error');
      }
    );
  }

  editPersona(persona: Persona): void {
    this.selectedPersona = persona;
    this.getLocalidades(persona.departamento_id); // Cargar localidades al editar
    console.log('Persona seleccionada:', this.selectedPersona); // Verificar la persona seleccionada
  }

  updatePersona(): void {
    if (!this.selectedPersona.nombre || !this.selectedPersona.apellido || !this.selectedPersona.dni) {
      Swal.fire('Formulario incompleto', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    this.personaService.updatePersona(this.selectedPersona).subscribe(
      res => {
        console.log('Persona actualizada', res);
        this.getPersonas();
        this.selectedPersona = new Persona();
        Swal.fire('Éxito', 'Persona actualizada con éxito', 'success');
      },
      error => {
        console.error('Error al actualizar persona', error);
        Swal.fire('Error', 'Error al actualizar la persona', 'error');
      }
    );
  }

  deletePersona(id: string): void {
    this.personaService.deletePersona(id).subscribe(
      res => {
        console.log('Persona eliminada', res);
        this.getPersonas();
        Swal.fire('Éxito', 'Persona eliminada con éxito', 'success');
      },
      error => {
        console.error('Error al eliminar persona', error);
        Swal.fire('Error', 'Error al eliminar la persona', 'error');
      }
    );
  }

  resetForm(): void {
    this.selectedPersona = new Persona();
    this.localidades = []; // Limpiar localidades al resetear el formulario
  }

  isFormIncomplete(): boolean {
    return !this.selectedPersona.nombre || !this.selectedPersona.apellido || !this.selectedPersona.dni || 
           !this.selectedPersona.provincia || !this.selectedPersona.departamento_id || 
           !this.selectedPersona.localidad_id || !this.selectedPersona.codigoPostal || 
           !this.selectedPersona.domicilio || !this.selectedPersona.fechaNacimiento || 
           !this.selectedPersona.sexo || !this.selectedPersona.edad;
  }

  searchPersonaByDni(dni: string): void {
    this.personaService.getPersonaByDni(dni).subscribe(
      data => {
        if (data) {
          this.selectedPersona = data;
          this.getLocalidades(data.departamento_id); // Cargar localidades al buscar por DNI
        } else {
          Swal.fire('No encontrado', 'No se encontró ninguna persona con ese DNI', 'info');
        }
      },
      error => {
        console.error('Error al buscar persona por DNI', error);
        Swal.fire('Error', 'Error al buscar la persona por DNI', 'error');
      }
    );
  }
}