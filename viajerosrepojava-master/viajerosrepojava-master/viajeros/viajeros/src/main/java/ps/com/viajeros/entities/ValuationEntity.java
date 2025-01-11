package ps.com.viajeros.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ps.com.viajeros.entities.user.UserEntity;

@Entity
@Table(name = "valuation")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ValuationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_valuation")
    private Long idValuation;

    @Column(name = "id_trip")
    private Long idTrip;

    @Column(name = "comments")
    private String comments;

    @Column(name = "rating")
    private Long rating;

    // Relación Muchos a Uno con UserEntity
    @ManyToOne
    @JoinColumn(name = "id_userValuated", nullable = false)
    private UserEntity userValuated;

    @ManyToOne
    @JoinColumn(name = "id_userWhoValuated", nullable = false)
    private UserEntity userWhoValuated;

}
