          <p className="text-sm text-green-200">
            <strong>Daily Diet Footprint:</strong> {DIET_EMISSIONS[dietType as keyof typeof DIET_EMISSIONS]} kg CO₂e
          </p>
          <p className="text-xs text-green-300 mt-1">
            {initialValue > 0 ? "✓ Loaded from previous entry" : "Updates shown in today's summary"}
          </p>