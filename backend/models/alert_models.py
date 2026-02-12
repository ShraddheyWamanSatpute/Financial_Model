"""
Alert Models for StockPulse Price Alert System
Defines data models for price alerts, conditions, and notifications
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from enum import Enum


class AlertCondition(str, Enum):
    """Alert trigger conditions"""
    PRICE_ABOVE = "price_above"       # Price goes above target
    PRICE_BELOW = "price_below"       # Price goes below target
    PRICE_CROSSES = "price_crosses"   # Price crosses target in either direction
    PERCENT_CHANGE = "percent_change" # Daily percent change exceeds threshold
    VOLUME_SPIKE = "volume_spike"     # Volume exceeds average by threshold


class AlertStatus(str, Enum):
    """Alert status"""
    ACTIVE = "active"       # Alert is active and monitoring
    TRIGGERED = "triggered" # Alert has been triggered
    EXPIRED = "expired"     # Alert has expired
    DISABLED = "disabled"   # Alert is disabled by user


class AlertPriority(str, Enum):
    """Alert priority level"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AlertCreate(BaseModel):
    """Model for creating a new alert"""
    symbol: str = Field(..., description="Stock symbol to monitor")
    condition: AlertCondition = Field(..., description="Condition that triggers the alert")
    target_value: float = Field(..., description="Target value for the condition")
    comparison_value: Optional[float] = Field(None, description="Second value for range-based conditions")
    priority: AlertPriority = Field(default=AlertPriority.MEDIUM, description="Alert priority")
    message: Optional[str] = Field(None, description="Custom alert message")
    expires_at: Optional[datetime] = Field(None, description="Alert expiration time")
    repeat: bool = Field(default=False, description="Whether alert can trigger multiple times")


class Alert(BaseModel):
    """Full alert model with all fields"""
    id: str = Field(..., description="Unique alert ID")
    symbol: str = Field(..., description="Stock symbol being monitored")
    stock_name: Optional[str] = Field(None, description="Stock name for display")
    condition: AlertCondition = Field(..., description="Trigger condition")
    target_value: float = Field(..., description="Target value for condition")
    comparison_value: Optional[float] = Field(None, description="Second value for range conditions")
    priority: AlertPriority = Field(default=AlertPriority.MEDIUM)
    message: Optional[str] = Field(None, description="Custom alert message")
    status: AlertStatus = Field(default=AlertStatus.ACTIVE)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(None)
    triggered_at: Optional[datetime] = Field(None)
    expires_at: Optional[datetime] = Field(None)
    
    # Trigger details
    trigger_price: Optional[float] = Field(None, description="Price when alert triggered")
    repeat: bool = Field(default=False)
    trigger_count: int = Field(default=0, description="Number of times alert has triggered")
    
    class Config:
        use_enum_values = True


class AlertUpdate(BaseModel):
    """Model for updating an existing alert"""
    target_value: Optional[float] = None
    comparison_value: Optional[float] = None
    priority: Optional[AlertPriority] = None
    message: Optional[str] = None
    status: Optional[AlertStatus] = None
    expires_at: Optional[datetime] = None
    repeat: Optional[bool] = None


class AlertNotification(BaseModel):
    """Notification sent when alert is triggered"""
    alert_id: str
    symbol: str
    stock_name: Optional[str]
    condition: AlertCondition
    target_value: float
    current_price: float
    message: str
    priority: AlertPriority
    triggered_at: datetime = Field(default_factory=datetime.utcnow)


class AlertSummary(BaseModel):
    """Summary of user's alerts"""
    total_alerts: int
    active_alerts: int
    triggered_today: int
    alerts_by_priority: dict
    alerts_by_symbol: dict


class AlertsResponse(BaseModel):
    """Response model for alert list endpoints"""
    alerts: List[Alert]
    total: int
    active: int
    triggered: int
