package com.windsurf.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_favorites",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "instrument_symbol"}))
public class UserFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "instrument_symbol", nullable = false)
    private Instrument instrument;
}
