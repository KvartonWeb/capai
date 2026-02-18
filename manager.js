// ========== CAP.AI Manager Dashboard Script ==========

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initSmoothScroll();
    initActiveSectionTracking();
    loadDashboardData();
});

// ========== Sidebar Toggle (Mobile) ==========
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggle) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
}

// ========== Smooth Scroll for Sidebar Links ==========
function initSmoothScroll() {
    document.querySelectorAll('.sidebar-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                const offset = window.innerWidth < 1024 ? 80 : 24;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                closeSidebar();
            }
        });
    });
}

// ========== Active Section Tracking ==========
function initActiveSectionTracking() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.sidebar-link[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

// ========== Dashboard Data ==========
function loadDashboardData() {
    // In a real app, this would be an API call.
    // Using sample data matching the HTML defaults.
    const data = getSampleData();
    calculateAndRender(data);
}

function getSampleData() {
    return {
        // A1. Inventory
        inventoryCost: 125400,
        inventorySaleValue: 187200,
        slowMovingInventory: 12300,

        // A2. Cash & Liquid
        cashBank: 45200,
        cashRegister: 3800,
        cashTransit: 8500,

        // A3. Supplier Prepayments
        prepaidAmount: 18600,
        prepaidExpectedDays: 7,

        // A4. Receivables
        receivables030: 34500,
        receivables3060: 22100,
        receivables60plus: 10700,
        doubtfulDebtPercent: 8.2,

        // B1. Supplier Obligations
        supplierTotal: 89400,
        supplier7Day: 15200,
        supplier30Day: 38600,
        supplierOverdue: 5300,

        // B2. Loan Obligations
        loanPrincipal: 120000,
        loanNextPayment: 4500,
        loanMonthlyPayment: 4500,
        loanInterestRate: 14.5,

        // B3. Tax Obligations
        taxVAT: 8200,
        taxIncome: 3400,
        taxOther: 1200,
        taxDeadline: '15 მარტი, 2026',

        // B4. Operational (Fixed)
        fixRent: 4500,
        fixSalary: 18200,
        fixUtility: 1800,
        fixSoftware: 2400,
        fixOther: 1600,

        // B4. Operational (Variable)
        varAds: 5200,
        varBonus: 3100,
        varCommission: 2800,
        varOther: 1400,

        // Revenue
        revenueDaily: 4250,
        revenueWeekly: 28700,
        revenueMonthly: 118500,
        revenueYearly: 1245000,

        // Profitability
        grossProfit: 35550,
        profitMarginPercent: 30,
        previousPeriodChange: 12.5,

        // Performance
        salesGrowth: 15.3,
        marginChange: 2.1,
        avgDailyRevenue: 3950,
        salesPerEmployee: 7406,
        salesPerSqm: 592,

        // Employees & Area (for calculations)
        employeeCount: 16,
        areaSqm: 200,

        // Average inventory for turnover
        avgInventory: 115000,
        costOfGoodsSold: 82950,
    };
}

function calculateAndRender(d) {
    // ===== Derived Calculations =====

    // Total Assets
    const totalReceivables = d.receivables030 + d.receivables3060 + d.receivables60plus;
    const totalCash = d.cashBank + d.cashRegister + d.cashTransit;

    const totalAssets = d.inventorySaleValue + totalCash + d.prepaidAmount + totalReceivables;

    // Total Fixed Expenses
    const totalFixedExpenses = d.fixRent + d.fixSalary + d.fixUtility + d.fixSoftware + d.fixOther;
    const dailyFixedExpense = totalFixedExpenses / 30;

    // Total Variable Expenses
    const totalVariableExpenses = d.varAds + d.varBonus + d.varCommission + d.varOther;

    // Total Tax
    const totalTax = d.taxVAT + d.taxIncome + d.taxOther;

    // 30-day payable
    const payable30Day = d.supplier30Day + d.loanMonthlyPayment + totalTax + totalFixedExpenses;

    // Available cash (cash - 30 day obligations)
    const availableCash = totalCash - payable30Day;

    // Total Current Liabilities
    const totalCurrentLiabilities = d.supplierTotal + d.loanMonthlyPayment + totalTax + totalFixedExpenses + totalVariableExpenses;

    // ===== KPI Calculations =====

    // 1. Net Working Capital
    const netWorkingCapital = totalAssets - totalCurrentLiabilities;

    // 2. Liquidity Ratio
    const liquidityRatio = payable30Day > 0 ? (totalCash / payable30Day) : 0;

    // 3. Break-even Revenue
    const breakEvenRevenue = d.profitMarginPercent > 0 ? (totalFixedExpenses / (d.profitMarginPercent / 100)) : 0;

    // 4. Cash Sufficiency Days
    const cashSufficiencyDays = dailyFixedExpense > 0 ? Math.round(totalCash / dailyFixedExpense) : 0;

    // 5. Obligation Pressure
    const obligationPressure = d.revenueMonthly > 0 ? (totalCurrentLiabilities / d.revenueMonthly) : 0;

    // 6. Inventory Turnover
    const inventoryTurnover = d.avgInventory > 0 ? (d.costOfGoodsSold / d.avgInventory) : 0;

    // Current Period P&L
    const currentPL = d.revenueMonthly - d.costOfGoodsSold - totalFixedExpenses - totalVariableExpenses;

    // Break-even status
    const breakEvenStatus = d.revenueMonthly - breakEvenRevenue;

    // 30-day obligation coverage
    const obligationCoverage30 = payable30Day > 0 ? ((totalCash / payable30Day) * 100) : 0;

    // Fixed expense coverage
    const fixedCoverage = totalFixedExpenses > 0 ? (totalCash / totalFixedExpenses) : 0;

    // Inventory to obligations ratio
    const invToOblRatio = totalCurrentLiabilities > 0 ? (d.inventorySaleValue / totalCurrentLiabilities) : 0;

    // Loan to revenue ratio
    const loanToRevenue = d.revenueMonthly > 0 ? Math.round((d.loanPrincipal / d.revenueMonthly) * 100) : 0;

    // Inventory Profit Potential
    const inventoryProfitPotential = d.inventorySaleValue - d.inventoryCost;

    // Revenue vs break-even
    const revenueVsBreakEven = d.revenueMonthly - breakEvenRevenue;

    // Pressure delta (surplus or deficit)
    const pressureDelta = totalCash - totalCurrentLiabilities;

    // ===== RENDER =====

    // 1. Status Badge
    renderFinancialStatus(netWorkingCapital, liquidityRatio, cashSufficiencyDays, obligationPressure);

    // Top KPI Cards
    renderKPIValue('nwcValue', netWorkingCapital, true);
    renderTrend('nwcTrend', netWorkingCapital >= 0);

    renderKPIValue('plValue', currentPL, true);
    renderTrend('plTrend', currentPL >= 0);

    el('liqValue').textContent = liquidityRatio.toFixed(2);
    renderTrend('liqTrend', liquidityRatio >= 1);

    el('cashDaysValue').textContent = cashSufficiencyDays;
    renderTrend('cashDaysTrend', cashSufficiencyDays >= 30);

    renderKPIValue('beValue', breakEvenStatus, true);
    renderTrend('beTrend', breakEvenStatus >= 0);

    el('obCovValue').textContent = Math.round(obligationCoverage30) + '%';
    renderTrend('obCovTrend', obligationCoverage30 >= 100);

    // A2 - Available Cash
    renderKPIValue('cashAvailable', availableCash > 0 ? availableCash : totalCash, true);

    // A4 - Total Receivables
    renderKPIValue('recTotal', totalReceivables, true);

    // B1 - Supplier distribution bar (recalculate percentages)
    const supRest = d.supplierTotal - d.supplier7Day - d.supplier30Day - d.supplierOverdue;

    // B2 - Loan to Revenue
    el('loanToRev').textContent = loanToRevenue + '%';

    // B4 - Fixed Total
    renderKPIValue('fixTotal', totalFixedExpenses, true);

    // 3. Pressure Block
    renderPressureStatus(pressureDelta, totalCash, totalCurrentLiabilities);
    renderKPIValue('prTotalObl', totalCurrentLiabilities, true);
    renderKPIValue('pr30Day', payable30Day, true);
    el('prCovRatio').textContent = liquidityRatio.toFixed(2);
    el('prFixCov').textContent = fixedCoverage.toFixed(2) + 'x';
    renderKPIValue('prBreakEven', breakEvenRevenue, true);
    el('prCashDays').textContent = cashSufficiencyDays;
    el('prInvToObl').textContent = invToOblRatio.toFixed(2) + 'x';

    // 4. Sales
    renderKPIValue('profVsBe', revenueVsBreakEven, true);

    // 5. KPI results
    renderKPIValue('kpi1Result', netWorkingCapital, true);
    el('kpi2Result').textContent = liquidityRatio.toFixed(2);
    renderKPIValue('kpi3Result', breakEvenRevenue, true);
    el('kpi4Result').textContent = cashSufficiencyDays + ' დღე';
    el('kpi5Result').textContent = obligationPressure.toFixed(2);
    el('kpi6Result').textContent = inventoryTurnover.toFixed(1) + 'x';

    // Pressure bar widths
    updateProgressBar('prTotalObl', totalCurrentLiabilities, totalAssets);
}

// ========== Render Helpers ==========

function el(id) {
    return document.getElementById(id);
}

function formatCurrency(amount) {
    const abs = Math.abs(amount);
    const formatted = abs >= 1000
        ? abs.toLocaleString('ka-GE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        : abs.toString();
    const sign = amount < 0 ? '-' : (amount > 0 ? '+' : '');
    return `₾ ${sign !== '-' ? '' : '-'}${formatted}`;
}

function renderKPIValue(elementId, value, isCurrency) {
    const element = el(elementId);
    if (!element) return;
    if (isCurrency) {
        element.textContent = formatCurrency(value);
        if (value < 0) {
            element.classList.add('text-red-400');
            element.classList.remove('text-cap-green');
        }
    } else {
        element.textContent = value;
    }
}

function renderTrend(elementId, isPositive) {
    const element = el(elementId);
    if (!element) return;

    if (isPositive) {
        element.classList.add('positive');
        element.classList.remove('negative');
        element.innerHTML = '<i class="fas fa-arrow-up mr-1"></i>კარგი';
    } else {
        element.classList.add('negative');
        element.classList.remove('positive');
        element.innerHTML = '<i class="fas fa-arrow-down mr-1"></i>ყურადღ.';
    }
}

function renderFinancialStatus(nwc, liqRatio, cashDays, oblPressure) {
    const card = document.getElementById('statusBadge');
    const text = el('statusText');
    const desc = el('statusDescription');
    const icon = el('statusIcon');

    // Scoring logic
    let score = 0;
    if (nwc > 0) score++;
    if (liqRatio >= 1.2) score++;
    else if (liqRatio >= 1) score += 0.5;
    if (cashDays >= 45) score++;
    else if (cashDays >= 20) score += 0.5;
    if (oblPressure < 1) score++;
    else if (oblPressure < 1.5) score += 0.5;

    card.classList.remove('stable', 'tense', 'critical');

    if (score >= 3) {
        card.classList.add('stable');
        text.textContent = 'სტაბილური';
        desc.querySelector('p').textContent = 'კომპანიის ფინანსური მდგომარეობა სტაბილურია. ვალდებულებები დაფარულია და საკმარისი რესურსი არსებობს.';
        icon.innerHTML = '<i class="fas fa-shield-halved"></i>';
    } else if (score >= 1.5) {
        card.classList.add('tense');
        text.textContent = 'დაძაბული';
        desc.querySelector('p').textContent = 'კომპანიის ფინანსური მდგომარეობა მოითხოვს ყურადღებას. ზოგიერთი მაჩვენებელი კრიტიკულ ზონაშია.';
        icon.innerHTML = '<i class="fas fa-triangle-exclamation"></i>';
    } else {
        card.classList.add('critical');
        text.textContent = 'კრიტიკული';
        desc.querySelector('p').textContent = 'კომპანიის ფინანსური მდგომარეობა კრიტიკულია. აუცილებელია გადაუდებელი ზომების მიღება.';
        icon.innerHTML = '<i class="fas fa-circle-exclamation"></i>';
    }
    desc.classList.remove('hidden');
}

function renderPressureStatus(delta, totalCash, totalObl) {
    const card = document.getElementById('pressureCard');
    const text = el('pressureText');
    const deltaEl = el('pressureDelta');

    card.classList.remove('sufficient', 'deficit');

    if (delta >= 0) {
        card.classList.add('sufficient');
        text.textContent = 'რესურსი საკმარისია';
        deltaEl.textContent = '+' + formatCurrency(delta);
        deltaEl.classList.add('text-cap-green');
        deltaEl.classList.remove('text-red-400');
    } else {
        card.classList.add('deficit');
        text.textContent = 'რესურსი არასაკმარისია';
        deltaEl.textContent = formatCurrency(delta);
        deltaEl.classList.add('text-red-400');
        deltaEl.classList.remove('text-cap-green');
    }
}

function updateProgressBar(parentId, value, maxValue) {
    const parent = el(parentId);
    if (!parent) return;
    const card = parent.closest('.rounded-2xl');
    if (!card) return;
    const bar = card.querySelector('.h-1 > div, .h-1\\.5 > div');
    if (bar) {
        const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
        bar.style.width = pct + '%';
    }
}

// ========== Refresh ==========
function refreshDashboard() {
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    icon.classList.add('animate-spin');

    setTimeout(() => {
        loadDashboardData();
        icon.classList.remove('animate-spin');

        const now = new Date();
        const months = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
        const dateStr = `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()} — ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        el('lastUpdate').textContent = dateStr;
    }, 800);
}

// ========== Animate spin utility ==========
const style = document.createElement('style');
style.textContent = `
    .animate-spin {
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
