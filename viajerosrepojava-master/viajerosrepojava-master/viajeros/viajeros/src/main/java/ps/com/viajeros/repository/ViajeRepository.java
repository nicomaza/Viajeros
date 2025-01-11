package ps.com.viajeros.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ps.com.viajeros.dtos.statistic.EstadoViajesDto;
import ps.com.viajeros.dtos.statistic.ViajesPorMesDto;
import ps.com.viajeros.entities.user.UserEntity;
import ps.com.viajeros.entities.viajes.StatusEntity;
import ps.com.viajeros.entities.viajes.ViajesEntity;
import ps.com.viajeros.entities.viajes.directions.LocalidadEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViajeRepository extends JpaRepository<ViajesEntity, Long> {


    // Buscar por localidades de inicio y fin, y filtrar por estado
    List<ViajesEntity> findByLocalidadInicioAndLocalidadFinAndEstado(LocalidadEntity localidadInicio, LocalidadEntity localidadFin, StatusEntity estado);

    // Buscar por localidad de inicio y filtrar por estado
    List<ViajesEntity> findByLocalidadInicioAndEstado(LocalidadEntity localidadInicio, StatusEntity estado);

    List<ViajesEntity> findByEstado(StatusEntity status);

    @Query("SELECT v FROM ViajesEntity v LEFT JOIN FETCH v.pasajeros WHERE v.estado = :estado AND v.fechaHoraInicio <= :fechaHoraInicio")
    List<ViajesEntity> findByEstadoAndFechaHoraInicioLessThanEqualFetchPasajeros(@Param("estado") StatusEntity estado, @Param("fechaHoraInicio") LocalDateTime fechaHoraInicio);
    @Query("SELECT v FROM ViajesEntity v LEFT JOIN FETCH v.pasajeros WHERE v.estado = :estado AND v.fechaHoraInicio BETWEEN :desde AND :hasta")
    List<ViajesEntity> findByEstadoAndFechaHoraInicioBetweenFetchPasajeros(@Param("estado") StatusEntity estado, @Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta);
    List<ViajesEntity> findByEstadoAndLocalidadInicioNot(StatusEntity estado, LocalidadEntity localidadInicio);

    // Buscar todos los viajes por objeto UserEntity (chofer) y lista de estados
    // Ajuste el nombre de la propiedad 'chofer' en lugar de 'user'
    List<ViajesEntity> findAllByChoferAndEstado(UserEntity chofer, StatusEntity estado);

    List<ViajesEntity> findAllByChoferAndEstadoIn(UserEntity chofer, List<StatusEntity> estados);
    List<ViajesEntity> findAllByPasajerosContainingAndEstadoIn(UserEntity pasajero, List<StatusEntity> estados);


    // Contar viajes finalizados como chofer
    Long countByChoferAndEstado(UserEntity chofer, StatusEntity estado);

    // Contar viajes pendientes como chofer
    Long countByChoferAndEstadoIn(UserEntity chofer, List<StatusEntity> estado);

    // Nueva consulta para buscar viajes donde el usuario es pasajero y el estado es específico
    @Query("SELECT v FROM ViajesEntity v JOIN v.pasajeros p WHERE p = :user AND v.estado = :estado")
    List<ViajesEntity> findAllByPasajeroAndEstado(@Param("user") UserEntity user, @Param("estado") StatusEntity estado);

    @Query("SELECT new ps.com.viajeros.dtos.statistic.ViajesPorMesDto(TO_CHAR(v.fechaHoraFin, 'YYYY-MM'), COUNT(v)) " +
            "FROM ViajesEntity v " +
            "WHERE v.estado.name = 'FINISHED' " +
            "GROUP BY TO_CHAR(v.fechaHoraFin, 'YYYY-MM') " +
            "ORDER BY TO_CHAR(v.fechaHoraFin, 'YYYY-MM') ASC")
    List<ViajesPorMesDto> getViajesFinalizadosPorMes();




    @Query("SELECT new ps.com.viajeros.dtos.statistic.EstadoViajesDto(v.estado.name, COUNT(v)) " +
            "FROM ViajesEntity v " +
            "GROUP BY v.estado.name")
    List<EstadoViajesDto> getEstadoDeLosViajes();

    List<ViajesEntity> findByfechaHoraInicioBetween(LocalDateTime startDate, LocalDateTime endDate);
}
