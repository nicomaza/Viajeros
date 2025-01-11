package ps.com.viajeros.services.impl;

import jakarta.websocket.OnClose;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ps.com.viajeros.dtos.car.CarResponseDto;
import ps.com.viajeros.dtos.car.NewCarRequestDto;
import ps.com.viajeros.entities.user.UserEntity;
import ps.com.viajeros.entities.VehicleEntity;
import ps.com.viajeros.repository.UserRepository;
import ps.com.viajeros.repository.VehicleRepository;
import ps.com.viajeros.services.VehicleService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public List<CarResponseDto> getAllCars(Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);

        // Verificar si el usuario existe
        if (userEntity.isPresent()) {
            // Obtener la lista de vehículos asociados al usuario
            List<VehicleEntity> vehicles = vehicleRepository.findByUser(userEntity.get());

            // Convertir la lista de VehicleEntity a CarResponseDto
            return vehicles.stream()
                    .filter(vehicle -> !vehicle.isDeleted())  // Filtrar vehículos no eliminados
                    .map(this::convertToCarResponseDto)       // Convertir VehicleEntity a CarResponseDto
                    .collect(Collectors.toList());
        }

        // Si no se encuentra el usuario, devolver una lista vacía o manejar el caso como prefieras
        return Collections.emptyList();
    }

    @Override
    public CarResponseDto registerVehicle(NewCarRequestDto newCarRequestDto) {
        // Validar si el usuario existe
        Optional<UserEntity> userEntityOptional = userRepository.findById(newCarRequestDto.getUserId());
        if (!userEntityOptional.isPresent()) {
            throw new RuntimeException("Usuario no encontrado para registrar el vehículo.");
        }

        // Crear una nueva entidad de vehículo explícitamente
        VehicleEntity vehicleEntity = new VehicleEntity();

        // Mapear manualmente los campos del DTO a la entidad del vehículo
        vehicleEntity.setBrand(newCarRequestDto.getBrand());
        vehicleEntity.setModel(newCarRequestDto.getModel());
        vehicleEntity.setPatent(newCarRequestDto.getPatent());
        vehicleEntity.setColor(newCarRequestDto.getColor());
        vehicleEntity.setFuel(newCarRequestDto.getFuel());
        vehicleEntity.setKmL(newCarRequestDto.getKml());
        vehicleEntity.setGnc(newCarRequestDto.isGnc());

        // Asociar el vehículo al usuario
        UserEntity userEntity = userEntityOptional.get();
        vehicleEntity.setUser(userEntity);

        // Asegurarse de que el ID sea nulo para registrar un nuevo vehículo
        vehicleEntity.setIdCar(null);

        // Guardar el vehículo en la base de datos
        VehicleEntity savedVehicle = vehicleRepository.save(vehicleEntity);

        // Mapear el VehicleEntity guardado a CarResponseDto
        CarResponseDto carResponseDto = modelMapper.map(savedVehicle, CarResponseDto.class);

        return carResponseDto;
    }

    @Override
    public CarResponseDto delete(Long id) {
        // Buscar la entidad antes de eliminarla
        Optional<VehicleEntity> vehicleEntityOptional = vehicleRepository.findById(id);

        // Verificar si el vehículo existe
        if (!vehicleEntityOptional.isPresent()) {
            throw new RuntimeException("Vehículo no encontrado para el ID: " + id);
        }

        // Mapear la entidad a DTO antes de eliminarla
        VehicleEntity vehicleEntity = vehicleEntityOptional.get();
        vehicleEntity.setDeleted(true);
        vehicleRepository.save(vehicleEntity);
        CarResponseDto carResponseDto = modelMapper.map(vehicleEntity, CarResponseDto.class);


        // Devolver el DTO del vehículo eliminado
        return carResponseDto;
    }

    public CarResponseDto updateVehicle(Long id, CarResponseDto carDto) {
        // Buscar el vehículo por id
        VehicleEntity vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehículo no encontrado con id: " + id));

        // Actualizar el vehículo con los datos del DTO
        modelMapper.map(carDto, vehicle);

        // Guardar cambios en la base de datos
        VehicleEntity updatedVehicle = vehicleRepository.save(vehicle);

        // Convertir la entidad actualizada en DTO y retornarla
        return modelMapper.map(updatedVehicle, CarResponseDto.class);
    }

    @Override
    public List<CarResponseDto> getAllVehicles() {
        // Obtén todos los vehículos y mapea a CarResponseDto
        return vehicleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CarResponseDto mapToDto(VehicleEntity vehicle) {
        return CarResponseDto.builder()
                .idCar(vehicle.getIdCar())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .patent(vehicle.getPatent())
                .color(vehicle.getColor())
                .fuel(vehicle.getFuel())
                .kml(vehicle.getKmL())
                .gnc(vehicle.isGnc())
                .deleted(vehicle.isDeleted())
                .build();
    }

    // Método de utilidad para convertir VehicleEntity a CarResponseDto
    private CarResponseDto convertToCarResponseDto(VehicleEntity vehicleEntity) {
        return modelMapper.map(vehicleEntity, CarResponseDto.class);
    }

    @Override
    public CarResponseDto getCarById(Long id) {
        // Buscar el vehículo por ID
        VehicleEntity vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehículo no encontrado con id: " + id));

        // Mapear la entidad VehicleEntity a CarResponseDto
        return mapToDto(vehicle);
    }


}
