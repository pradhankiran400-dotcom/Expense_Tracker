
from sqlalchemy.orm import Session

import models
import schemas


# CREATE: Add a new expense
def create_expense(db: Session, expense: schemas.ExpenseCreate):
    db_expense = models.Expense(**expense.model_dump(exclude_unset=True))

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    return db_expense


# READ: Get all expenses
def get_expenses(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Expense)
        .order_by(models.Expense.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# READ: Get one expense by ID
def get_expense(db: Session, expense_id: int):
    return (
        db.query(models.Expense)
        .filter(models.Expense.id == expense_id)
        .first()
    )


# UPDATE: Update an existing expense
def update_expense(
    db: Session,
    expense_id: int,
    expense: schemas.ExpenseUpdate
):
    db_expense = get_expense(db, expense_id)

    if db_expense is None:
        return None

    update_data = expense.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_expense, key, value)

    db.commit()
    db.refresh(db_expense)

    return db_expense


# DELETE: Delete an expense
def delete_expense(db: Session, expense_id: int):
    db_expense = get_expense(db, expense_id)

    if db_expense is None:
        return None

    db.delete(db_expense)
    db.commit()

    return db_expense
