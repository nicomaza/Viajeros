package ps.com.viajeros.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ps.com.viajeros.dtos.incidente.IncidentesForAdminDto;
import ps.com.viajeros.dtos.incidente.ResolveIncidenteDto;
import ps.com.viajeros.dtos.viaje.incidentes.IncidenteDto;
import ps.com.viajeros.entities.user.UserEntity;
import ps.com.viajeros.entities.viajes.IncidenteEntity;
import ps.com.viajeros.entities.viajes.ViajesEntity;
import ps.com.viajeros.repository.UserRepository;
import ps.com.viajeros.services.IncidenteService;

import java.util.List;

@RestController
@RequestMapping("/api/incidentes")
public class IncidenteController {

    @Autowired
    private IncidenteService incidenteService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/registrar/{idViaje}")
    public ResponseEntity<IncidenteEntity> registrarIncidente(@PathVariable Long idViaje, @RequestBody IncidenteDto incidenteDto) {
        // Convertir DTO a entidad
        IncidenteEntity incidenteEntity = convertirDtoAEntidad(incidenteDto, idViaje);

        // Registrar el incidente
        IncidenteEntity nuevoIncidente = incidenteService.registrarIncidente(idViaje, incidenteEntity);
        return new ResponseEntity<>(nuevoIncidente, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IncidenteDto>> getAllIncidentes() {
        List<IncidenteDto> incidentes = incidenteService.getAllIncidentes();
        return ResponseEntity.ok(incidentes);
    }

    // Método para convertir el DTO a la entidad


    private IncidenteEntity convertirDtoAEntidad(IncidenteDto incidenteDto, Long idViaje) {

        // Obtén la entidad del viaje por su ID
        ViajesEntity viaje = incidenteService.obtenerViajePorId(idViaje);

        // Determina quién es el denunciado
        UserEntity denunciado;
        if (incidenteDto.getDenunciadoId() == 0) {
            // Si el id es 0, asigna el chofer del viaje como denunciado
            denunciado = viaje.getChofer();
        } else {
            // Caso contrario, busca el usuario por el ID proporcionado
            denunciado = userRepository.getReferenceById(incidenteDto.getDenunciadoId());
        }

        // Crear la entidad IncidenteEntity
        IncidenteEntity incidenteEntity = new IncidenteEntity();
        incidenteEntity.setDescripcion(incidenteDto.getDescripcion());
        incidenteEntity.setTipoIncidente(incidenteDto.getTipoIncidente());
        incidenteEntity.setFechaIncidente(incidenteDto.getFechaIncidente());
        incidenteEntity.setDenunciado(denunciado);
        incidenteEntity.setEstadoResolucion(incidenteDto.getEstadoResolucion());
        incidenteEntity.setResolucion(incidenteDto.getResolucion());
        incidenteEntity.setFechaResolucion(incidenteDto.getFechaResolucion());
        incidenteEntity.setIsPasajero(incidenteDto.getIsPasajero());

        // Obtén el usuario que reportó el incidente
        UserEntity reportadoPor = incidenteService.obtenerUsuarioPorId(incidenteDto.getReportadoPorId());
        incidenteEntity.setReportadoPor(reportadoPor);

        // Asocia el viaje al incidente
        incidenteEntity.setViaje(viaje);

        return incidenteEntity;
    }


    @GetMapping("/admin")
    public List<IncidentesForAdminDto> getIncidentesForAdmin() {
        return incidenteService.getAllIncidentesForAdmin();
    }

    @PutMapping("/resolver/{idIncidente}")
    public ResponseEntity<IncidenteEntity> resolverIncidente(@PathVariable Long idIncidente, @RequestBody ResolveIncidenteDto resolveDto) {
        IncidenteEntity incidenteActualizado = incidenteService.resolverIncidente(idIncidente, resolveDto);
        if (incidenteActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(incidenteActualizado);
    }
}
