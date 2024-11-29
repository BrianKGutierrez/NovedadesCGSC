import { Component, OnInit } from '@angular/core';
import { DependenciaService } from '../../../services/dependencia.service';
import { UnidadRegionalService } from '../../../services/unidad_regional.service';
import { LocalidadService } from '../../../services/localidad.service';
import { DepartamentoService } from '../../../services/departamento.service';
import { Dependencia } from '../../../models/dependencia';
import { UnidadRegional } from '../../../models/unidad_regional';
import { Localidad } from '../../../models/localidad';
import { Departamento } from '../../../models/departamento';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dependencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dependencia.component.html',
  styleUrls: ['./dependencia.component.scss']
})
export class DependenciaComponent implements OnInit {
  dependencias: Dependencia[] = [];
  unidadesRegionales: UnidadRegional[] = [];
  localidades: Localidad[] = [];
  departamentos: Departamento[] = [];
  selectedDependencia: Dependencia = new Dependencia();
  mensajeError: string = '';

  constructor(
    private dependenciaService: DependenciaService,
    private unidadRegionalService: UnidadRegionalService,
    private localidadService: LocalidadService,
    private departamentoService: DepartamentoService
  ) { }

  ngOnInit(): void {
    this.getDependencias();
    this.getUnidadesRegionales();
    this.getDepartamentos();
  }

  
getDependencias(): void {
  this.dependenciaService.getDependencias().subscribe(
    data => {
      this.dependencias = data;
      // Para cada dependencia, actualizamos los nombres basados en los IDs
      this.dependencias.forEach(dependencia => {
        if (dependencia.unidad_regional_id) {
          this.updateUnidadRegionalNombre(dependencia);
        } else {
          dependencia.unidad_regional_nombre = 'Desconocido';
        }
        if (dependencia.localidad_id) {
          this.updateLocalidadNombre(dependencia);
        } else {
          dependencia.localidad_nombre = 'Desconocido';
        }
        if (dependencia.departamento_id) {
          this.updateDepartamentoNombre(dependencia); // Actualizar nombre del departamento
        } else {
          dependencia.departamento_nombre = 'Desconocido';
        }
      });
    },
    error => {
      console.error('Error al obtener las dependencias:', error);
    }
  );
}

  getUnidadesRegionales(): void {
    this.unidadRegionalService.getUnidadesRegionales().subscribe(
      data => {
        this.unidadesRegionales = data;
      },
      error => {
        console.error('Error al obtener las unidades regionales:', error);
      }
    );
  }

  getDepartamentos(): void {
    this.departamentoService.getDepartamentos().subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }

  getLocalidades(departamentoId: string): void {
    this.localidadService.getLocalidadesByDepartamento(departamentoId).subscribe(
      data => {
        this.localidades = data;
        console.log('Localidades cargadas:', this.localidades);
      },
      error => {
        console.error('Error al obtener las localidades:', error);
      }
    );
  }

  updateUnidadRegionalNombre(dependencia: Dependencia): void {
    this.unidadRegionalService.getUnidadRegional(Number(dependencia.unidad_regional_id)).subscribe(
      unidadRegional => {
        dependencia.unidad_regional_nombre = unidadRegional.unidad_regional;
      },
      error => {
        console.error('Error al obtener la unidad regional:', error);
        dependencia.unidad_regional_nombre = 'Desconocido';
      }
    );
  }

    updateLocalidadNombre(dependencia: Dependencia): void {
    this.localidadService.getLocalidadById(dependencia.localidad_id).subscribe(
      localidad => {
        dependencia.localidad_nombre = localidad.nombre;
      },
      error => {
        console.error('Error al obtener la localidad:', error);
        dependencia.localidad_nombre = 'Desconocido';
      }
    );
  }
  
  updateDepartamentoNombre(dependencia: Dependencia): void {
    this.departamentoService.getDepartamentoById(dependencia.departamento_id).subscribe(
      departamento => {
        dependencia.departamento_nombre = departamento.nombre;
      },
      error => {
        console.error('Error al obtener el departamento:', error);
        dependencia.departamento_nombre = 'Desconocido';
      }
    );
  }

  guardarDependencia(): void {
    if (this.selectedDependencia.id) {
      this.dependenciaService.updateDependencia(this.selectedDependencia).subscribe(
        () => {
          this.getDependencias();
          this.resetForm();
        },
        error => console.error('Error al actualizar la dependencia:', error)
      );
    } else {
      this.dependenciaService.createDependencia(this.selectedDependencia).subscribe(
        () => {
          this.getDependencias();
          this.resetForm();
        },
        error => console.error('Error al crear la dependencia:', error)
      );
    }
  }

  editarDependencia(dependencia: Dependencia): void {
    this.selectedDependencia = { ...dependencia };
    this.getLocalidades(dependencia.departamento_id); // Cargar localidades al editar
  }

  eliminarDependencia(id: string): void {
    this.dependenciaService.deleteDependencia(id).subscribe(
      () => this.getDependencias(),
      error => console.error('Error al eliminar la dependencia:', error)
    );
  }

  resetForm(): void {
    this.selectedDependencia = new Dependencia();
    this.mensajeError = '';
  }
}