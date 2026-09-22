package com.acentra.intelligence.model;

public enum ProductCriticality {
    LIFE_SAVING(30, 25),   // Life saving / ICU items (e.g. Oxygen, Nebulizer, Blood pressure monitor)
    ESSENTIAL(20, 15),     // Essential clinical devices & sterile sets (e.g. IV set, Syringes, Thermometer)
    STANDARD(10, 10);      // Standard consumables (e.g. Gloves, Face masks)

    private final int priorityWeight;
    private final int defaultSafetyThreshold;

    ProductCriticality(int priorityWeight, int defaultSafetyThreshold) {
        this.priorityWeight = priorityWeight;
        this.defaultSafetyThreshold = defaultSafetyThreshold;
    }

    public int getPriorityWeight() {
        return priorityWeight;
    }

    public int getDefaultSafetyThreshold() {
        return defaultSafetyThreshold;
    }

    public static ProductCriticality fromSku(String sku) {
        if (sku == null) return STANDARD;
        String upper = sku.toUpperCase();
        if (upper.contains("OX") || upper.contains("BP") || upper.contains("FA") || upper.contains("NEB")) {
            return LIFE_SAVING;
        } else if (upper.contains("IV") || upper.contains("SYR") || upper.contains("TH")) {
            return ESSENTIAL;
        } else {
            return STANDARD;
        }
    }
}
