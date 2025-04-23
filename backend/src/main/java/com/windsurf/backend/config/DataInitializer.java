package com.windsurf.backend.config;

import com.windsurf.backend.model.Instrument;
import com.windsurf.backend.repository.InstrumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final InstrumentRepository instrumentRepository;

    @Override
    public void run(String... args) {
        // Solo inicializar si no hay instrumentos
        if (instrumentRepository.count() == 0) {
            var instruments = Arrays.asList(
                new Instrument("AAPL", "Apple Inc.", 170.50, 1.2, 0.8, 172.0, 169.0, 1000000, "2024-04-22"),
                new Instrument("GOOGL", "Alphabet Inc.", 2800.0, 0.5, 1.5, 2850.0, 2780.0, 500000, "2024-04-22"),
                new Instrument("MSFT", "Microsoft Corporation", 380.0, -0.3, 0.9, 385.0, 378.0, 750000, "2024-04-22"),
                new Instrument("AMZN", "Amazon.com Inc.", 180.0, 2.1, 1.8, 183.0, 178.0, 900000, "2024-04-22"),
                new Instrument("TSLA", "Tesla Inc.", 150.0, -1.5, -0.7, 152.0, 148.0, 1200000, "2024-04-22"),
                new Instrument("META", "Meta Platforms Inc.", 500.0, 0.8, 1.2, 505.0, 495.0, 600000, "2024-04-22"),
                new Instrument("NFLX", "Netflix Inc.", 450.0, 1.7, 2.3, 455.0, 445.0, 300000, "2024-04-22"),
                new Instrument("NVDA", "NVIDIA Corporation", 880.0, 3.2, 4.1, 890.0, 870.0, 800000, "2024-04-22"),
                new Instrument("JPM", "JPMorgan Chase & Co.", 180.0, 0.4, 0.6, 182.0, 179.0, 400000, "2024-04-22"),
                new Instrument("V", "Visa Inc.", 270.0, 0.9, 1.1, 272.0, 268.0, 350000, "2024-04-22")
            );
            
            instrumentRepository.saveAll(instruments);
        }
    }
}
