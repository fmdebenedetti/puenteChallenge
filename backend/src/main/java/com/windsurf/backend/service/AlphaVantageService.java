package com.windsurf.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.windsurf.backend.model.Instrument;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AlphaVantageService {

    private final WebClient webClient;
    private final String apiKey;

    public AlphaVantageService(@Value("${alphavantage.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://www.alphavantage.co")
                .build();
    }

    @Cacheable(value = "globalQuote", key = "#symbol")
    public Mono<Instrument> getGlobalQuote(String symbol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", "GLOBAL_QUOTE")
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(this::mapToInstrument);
    }

    @Cacheable(value = "dailyTimeSeries", key = "#symbol")
    public Mono<Instrument> getDailyTimeSeries(String symbol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/query")
                        .queryParam("function", "TIME_SERIES_DAILY")
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(this::mapToInstrumentWithHistory);
    }

    private Instrument mapToInstrument(JsonNode response) {
        JsonNode quote = response.get("Global Quote");
        if (quote == null || quote.isNull() || !quote.has("01. symbol")) {
            throw new RuntimeException("No se pudo obtener cotización. Respuesta AlphaVantage: " + response.toString());
        }
        Instrument instrument = new Instrument();
        instrument.setSymbol(quote.get("01. symbol").asText());
        instrument.setCurrentPrice(new BigDecimal(quote.get("05. price").asText()));
        instrument.setDailyChange(new BigDecimal(quote.get("09. change").asText()));
        instrument.setVolume(quote.get("06. volume").asLong());
        instrument.setDayHigh(new BigDecimal(quote.get("03. high").asText()));
        instrument.setDayLow(new BigDecimal(quote.get("04. low").asText()));
        instrument.setLastUpdated(LocalDateTime.now());
        return instrument;
    }

    private Instrument mapToInstrumentWithHistory(JsonNode response) {
        JsonNode timeSeries = response.get("Time Series (Daily)");
        List<BigDecimal> weeklyPrices = new ArrayList<>();
        
        timeSeries.fields().forEachRemaining(entry -> {
            if (weeklyPrices.size() < 5) {
                weeklyPrices.add(new BigDecimal(entry.getValue().get("4. close").asText()));
            }
        });

        Instrument instrument = new Instrument();
        instrument.setSymbol(response.get("Meta Data").get("2. Symbol").asText());
        
        if (!weeklyPrices.isEmpty()) {
            BigDecimal currentPrice = weeklyPrices.get(0);
            BigDecimal weekAgoPrice = weeklyPrices.get(weeklyPrices.size() - 1);
            BigDecimal weeklyChange = currentPrice.subtract(weekAgoPrice)
                    .divide(weekAgoPrice, java.math.RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            instrument.setWeeklyChange(weeklyChange);
        }

        return instrument;
    }
}
