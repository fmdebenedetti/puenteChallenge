package com.windsurf.backend.repository;

import com.windsurf.backend.model.Instrument;
import com.windsurf.backend.model.User;
import com.windsurf.backend.model.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    List<UserFavorite> findByUser(User user);
    Optional<UserFavorite> findByUserAndInstrument(User user, Instrument instrument);
    boolean existsByUserAndInstrument(User user, Instrument instrument);
}
