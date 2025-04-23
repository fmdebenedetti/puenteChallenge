package com.windsurf.backend.repository;

import com.windsurf.backend.model.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InstrumentRepository extends JpaRepository<Instrument, String> {
    @Query("SELECT i FROM Instrument i WHERE LOWER(i.symbol) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Instrument> searchBySymbolOrName(@Param("query") String query);
}
