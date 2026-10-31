
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class ExpenseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    category: str = Field(min_length=1, max_length=50)
    description: str | None = None
    expense_date: date | None = None


class ExpenseUpdate(ExpenseCreate):
    pass


class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: Decimal
    category: str
    description: str | None
    expense_date: date
    model_config = ConfigDict(from_attributes=True)


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
