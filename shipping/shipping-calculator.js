/* ============================================
   JOIS — Shipping Calculator
   ============================================ */

class ShippingCalculator {
    constructor(configUrl) {
        this.config = null;
        this.configUrl = configUrl;
        this.cache = null;
    }

    async loadConfig() {
        if (this.config) return this.config;
        
        try {
            const response = await fetch(this.configUrl);
            this.config = await response.json();
            return this.config;
        } catch (error) {
            console.error('Error loading shipping config:', error);
            return null;
        }
    }

    findZoneByCountry(countryCode) {
        if (!this.config) return null;
        
        return this.config.zones.find(zone => 
            zone.countries.includes(countryCode.toUpperCase())
        );
    }

    calculateRate(zone, weightKg, rateType = 'standard') {
        if (!zone || !zone.rates || !zone.rates[rateType]) {
            return null;
        }

        const rate = zone.rates[rateType];
        const weight = Math.max(weightKg, 0.1); // Mínimo 100g
        const calculated = rate.base_rate + (weight * rate.per_kg_rate);
        
        return {
            cost: calculated,
            currency: zone.currency,
            currency_symbol: zone.currency_symbol,
            estimated_days: rate.estimated_days,
            provider: rate.provider
        };
    }

    async calculate(countryCode, weightKg = 1.0, subtotal = 0) {
        const config = await this.loadConfig();
        if (!config) {
            return { error: true, message: config.messages.no_shipping };
        }

        const zone = this.findZoneByCountry(countryCode);
        
        if (!zone) {
            return { 
                error: true, 
                message: config.messages.no_shipping,
                contact_email: config.fallback.contact_email
            };
        }

        // Check free shipping threshold
        const freeShipping = zone.free_shipping_threshold && 
                           subtotal >= zone.free_shipping_threshold;

        // Calculate both rates
        const standardRate = this.calculateRate(zone, weightKg, 'standard');
        const expressRate = this.calculateRate(zone, weightKg, 'express');

        const result = {
            zone: zone.zone_name,
            currency: zone.currency,
            currency_symbol: zone.currency_symbol,
            free_shipping: freeShipping,
            free_threshold: freeShipping ? zone.free_shipping_threshold : null,
            options: []
        };

        if (standardRate) {
            result.options.push({
                type: 'standard',
                cost: freeShipping ? 0 : standardRate.cost,
                display_cost: freeShipping ? 'GRATIS' : `${zone.currency_symbol}${Math.round(standardRate.cost)}`,
                estimated_days: standardRate.estimated_days,
                provider: standardRate.provider
            });
        }

        if (expressRate) {
            result.options.push({
                type: 'express',
                cost: freeShipping ? 0 : expressRate.cost,
                display_cost: freeShipping ? 'GRATIS' : `${zone.currency_symbol}${Math.round(expressRate.cost)}`,
                estimated_days: expressRate.estimated_days,
                provider: expressRate.provider
            });
        }

        return result;
    }

    async getEstimates(countryCode, weightKg = 1.0, subtotal = 0) {
        return this.calculate(countryCode, weightKg, subtotal);
    }
}

// Global instance
const shippingCalculator = new ShippingCalculator('shipping/config.json');

// Export for use
window.shippingCalculator = shippingCalculator;