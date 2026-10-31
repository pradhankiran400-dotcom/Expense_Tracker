
const API = "https://expense-tracker-gg9y.onrender.com";
const token = localStorage.getItem("access_token");

if (!token) {
    window.location.href = "login.html";
} else {
    // ---------- Authentication ----------

    // Reusable authenticated API request
    async function authenticatedFetch(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "login.html";
            throw new Error("Session expired. Please login again.");
        }

        return response;
    }

    // ---------- DOM Elements ----------

    const form = document.getElementById("expenseForm");
    const list = document.getElementById("expenseList");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("count");
    const topCategoryEl = document.getElementById("topCategory");
    const message = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");

    // ---------- Light / Dark Mode ----------

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeLabel = document.getElementById("themeLabel");

    function applyTheme(theme) {
        if (!themeIcon || !themeLabel) {
            return;
        }

        document.body.classList.toggle("dark", theme === "dark");

        themeIcon.textContent = theme === "dark" ? "☀" : "☾";

        themeLabel.textContent =
            theme === "dark" ? "Light mode" : "Dark mode";
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("spendly-theme") || "light";
    } catch (error) {
        console.error("Could not load theme preference:", error);
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("dark")
                ? "light"
                : "dark";

            applyTheme(nextTheme);

            try {
                localStorage.setItem("spendly-theme", nextTheme);
            } catch (error) {
                console.error("Could not save theme preference:", error);
            }
        });
    }

    // ---------- Helpers ----------

    function showMessage(text, isError = true) {
        if (!message) {
            return;
        }

        message.textContent = text;
        message.style.color = isError ? "#dc5252" : "#16a36a";
    }

    function formatMoney(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // ---------- Load Expenses ----------

    async function loadExpenses() {
        if (!list) {
            return;
        }

        list.replaceChildren(
            makeElement("p", "muted", "Loading expenses...")
        );

        try {
            const response = await authenticatedFetch(`${API}/expenses`);

            if (!response.ok) {
                throw new Error(`Backend returned ${response.status}`);
            }

            const expenses = await response.json();

            if (!Array.isArray(expenses)) {
                throw new Error("Unexpected response from backend");
            }

            list.replaceChildren();

            let total = 0;
            const categoryTotals = {};

            expenses.forEach(expense => {
                const amount = Number(expense.amount) || 0;
                total += amount;

                const category = expense.category || "Other";
                categoryTotals[category] =
                    (categoryTotals[category] || 0) + amount;
            });

            if (totalEl) {
                totalEl.textContent = formatMoney(total);
            }

            if (countEl) {
                countEl.textContent = expenses.length;
            }

            const topCategory = Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])[0];

            if (topCategoryEl) {
                topCategoryEl.textContent = topCategory ? topCategory[0] : "—";
            }

            if (expenses.length === 0) {
                list.appendChild(
                    makeElement(
                        "div",
                        "empty-state",
                        "No expenses yet. Add your first expense!"
                    )
                );

                return;
            }

            expenses.sort((a, b) => Number(b.id) - Number(a.id));

            expenses.forEach(expense => {
                const row = makeElement("div", "expense-row");
                const details = makeElement("div", "expense-details");

                details.appendChild(
                    makeElement("h3", "expense-title", expense.title)
                );

                if (expense.description) {
                    details.appendChild(
                        makeElement("p", "expense-meta", expense.description)
                    );
                }

                if (expense.expense_date) {
                    details.appendChild(
                        makeElement("p", "expense-meta", expense.expense_date)
                    );
                }

                details.appendChild(
                    makeElement("span", "category-pill", expense.category || "Other")
                );

                const right = makeElement("div", "expense-right");

                right.appendChild(
                    makeElement("span", "expense-amount", formatMoney(expense.amount))
                );

                const deleteBtn = makeElement("button", "delete-btn", "Delete");
                deleteBtn.type = "button";

                deleteBtn.addEventListener("click", async () => {
                    if (!confirm(`Delete "${expense.title}"?`)) {
                        return;
                    }

                    deleteBtn.disabled = true;

                    try {
                        const result = await authenticatedFetch(
                            `${API}/expenses/${expense.id}`,
                            { method: "DELETE" }
                        );

                        if (!result.ok) {
                            throw new Error("Could not delete expense");
                        }

                        showMessage("Expense deleted successfully.", false);
                        await loadExpenses();
                    } catch (error) {
                        showMessage(error.message);
                        deleteBtn.disabled = false;
                    }
                });

                right.appendChild(deleteBtn);
                row.append(details, right);
                list.appendChild(row);
            });
        } catch (error) {
            list.replaceChildren(
                makeElement("div", "empty-state", "Could not load expenses.")
            );

            showMessage(`${error.message}. Check your backend and CORS settings.`);
        }
    }

    // ---------- Add Expense ----------

    if (form) {
        form.addEventListener("submit", async event => {
            event.preventDefault();
            showMessage("");

            const expense = {
                title: document.getElementById("title").value.trim(),
                amount: Number(document.getElementById("amount").value),
                category: document.getElementById("category").value,
                description: document.getElementById("description").value.trim()
            };

            if (
                !expense.title ||
                !expense.category ||
                !Number.isFinite(expense.amount) ||
                expense.amount <= 0
            ) {
                showMessage("Please enter a valid name, category and amount.");
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Saving...";
            }

            try {
                const response = await authenticatedFetch(`${API}/expenses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(expense)
                });

                if (!response.ok) {
                    const details = await response.text();
                    throw new Error(details || "Could not save expense");
                }

                form.reset();
                showMessage("Expense added successfully!", false);
                await loadExpenses();
            } catch (error) {
                showMessage(`Unable to save expense. ${error.message}`);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "+ Add expense";
                }
            }
        });
    }

    // ---------- Refresh Expenses ----------

    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadExpenses);
    }

    // ---------- Logout ----------

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("access_token");
            window.location.href = "login.html";
        });
    }

    // ---------- Initial Load ----------
    loadExpenses();
}
