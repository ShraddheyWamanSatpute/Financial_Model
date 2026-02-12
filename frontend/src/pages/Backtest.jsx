import React from "react";

export default function Backtest() {
    return (
        <div style={{ padding: "24px" }}>
            <h1 style={{ color: "white", fontSize: "24px", marginBottom: "16px" }}>
                Strategy Backtest
            </h1>
            <div style={{
                backgroundColor: "#18181B",
                borderRadius: "8px",
                padding: "48px",
                textAlign: "center"
            }}>
                <h2 style={{ color: "white", marginBottom: "8px" }}>
                    Backtesting Feature
                </h2>
                <p style={{ color: "#71717A" }}>
                    Backend API is ready at /api/backtest/strategies
                </p>
                <p style={{ color: "#71717A", marginTop: "8px" }}>
                    Frontend implementation coming soon.
                </p>
            </div>
        </div>
    );
}
