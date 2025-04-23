package com.windsurf.backend.controller;

import com.windsurf.backend.model.Instrument;
import com.windsurf.backend.model.User;
import com.windsurf.backend.model.UserFavorite;
import com.windsurf.backend.repository.InstrumentRepository;
import com.windsurf.backend.repository.UserFavoriteRepository;
import com.windsurf.backend.service.AlphaVantageService;
import com.windsurf.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/instruments")
@RequiredArgsConstructor
public class InstrumentController {

    private final InstrumentRepository instrumentRepository;
    private final UserFavoriteRepository userFavoriteRepository;
    private final UserService userService;
    private final AlphaVantageService alphaVantageService;

    @GetMapping
    public List<Instrument> getAllInstruments() {
        return instrumentRepository.findAll();
    }

    @GetMapping("/search")
    public List<Instrument> searchInstruments(@RequestParam String query) {
        return instrumentRepository.searchBySymbolOrName(query);
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<Instrument> getInstrument(@PathVariable String symbol) {
        return alphaVantageService.getGlobalQuote(symbol)
                .map(ResponseEntity::ok)
                .block();
    }

    @GetMapping("/{symbol}/details")
    public ResponseEntity<Instrument> getInstrumentDetails(@PathVariable String symbol) {
        return alphaVantageService.getGlobalQuote(symbol)
                .map(ResponseEntity::ok)
                .block();
    }

    @GetMapping("/favorites")
    public List<Instrument> getFavorites() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName()).orElseThrow();
        return userFavoriteRepository.findByUser(user)
                .stream()
                .map(UserFavorite::getInstrument)
                .toList();
    }

    @PostMapping("/{symbol}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable String symbol) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName()).orElseThrow();
        
        Optional<Instrument> instrumentOpt = instrumentRepository.findById(symbol);
        if (instrumentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Instrument instrument = instrumentOpt.get();
        Optional<UserFavorite> existingFavorite = userFavoriteRepository.findByUserAndInstrument(user, instrument);
        
        if (existingFavorite.isPresent()) {
            userFavoriteRepository.delete(existingFavorite.get());
            return ResponseEntity.ok().body("Instrumento removido de favoritos");
        } else {
            UserFavorite newFavorite = new UserFavorite();
            newFavorite.setUser(user);
            newFavorite.setInstrument(instrument);
            userFavoriteRepository.save(newFavorite);
            return ResponseEntity.ok().body("Instrumento agregado a favoritos");
        }
    }
}
