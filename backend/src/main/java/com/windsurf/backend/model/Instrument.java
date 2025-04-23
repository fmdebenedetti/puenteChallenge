package com.windsurf.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "instruments")
public class Instrument {
    @Id
    private String symbol;
    
    private String name;
    private BigDecimal currentPrice;
    private BigDecimal dailyChange;
    private BigDecimal weeklyChange;
    private BigDecimal dayHigh;
    private BigDecimal dayLow;
    private Long volume;
    private LocalDateTime lastUpdated;

    public Instrument(String symbol, String name, double currentPrice, double dailyChange, 
                     double weeklyChange, double dayHigh, double dayLow, long volume, String date) {
        this.symbol = symbol;
        this.name = name;
        this.currentPrice = BigDecimal.valueOf(currentPrice);
        this.dailyChange = BigDecimal.valueOf(dailyChange);
        this.weeklyChange = BigDecimal.valueOf(weeklyChange);
        this.dayHigh = BigDecimal.valueOf(dayHigh);
        this.dayLow = BigDecimal.valueOf(dayLow);
        this.volume = volume;
        this.lastUpdated = LocalDateTime.parse(date + "T00:00:00");
    }
}
