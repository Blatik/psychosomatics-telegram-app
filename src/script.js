class PsychosomaticsApp {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.displayAll();
    }

    async loadData() {
        try {
            const response = await fetch('../data/psychosomatics_data.json');
            this.data = await response.json();
            this.filteredData = [...this.data];
            this.updateStats();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        searchBtn.addEventListener('click', () => this.search());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });

        searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                this.displayAll();
            }
        });
    }

    search() {
        const query = document.getElementById('searchInput').value.toLowerCase().trim();
        
        if (query === '') {
            this.displayAll();
            return;
        }

        this.filteredData = this.data.filter(item => 
            item['Болезнь'].toLowerCase().includes(query) ||
            item['Причина'].toLowerCase().includes(query) ||
            item['Аффирмации'].toLowerCase().includes(query)
        );

        this.displayResults();
        this.updateStats();
    }

    displayAll() {
        this.filteredData = [...this.data];
        this.displayResults();
        this.updateStats();
    }

    displayResults() {
        const resultsContainer = document.getElementById('results');
        
        if (this.filteredData.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">Ничего не найдено</div>';
            return;
        }

        const html = this.filteredData.map(item => this.createDiseaseCard(item)).join('');
        resultsContainer.innerHTML = html;
    }

    createDiseaseCard(item) {
        return `
            <div class="disease-card">
                <div class="disease-name">${item['Болезнь']}</div>
                <div class="cause-section">
                    <div class="section-title">Причина:</div>
                    <div class="cause-text">${item['Причина']}</div>
                </div>
                <div class="affirmation-section">
                    <div class="section-title">Аффирмация:</div>
                    <div class="affirmation-text">${item['Аффирмации']}</div>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalCount = document.getElementById('totalCount');
        const filteredCount = document.getElementById('filteredCount');
        
        totalCount.textContent = `Всего записей: ${this.data.length}`;
        
        if (this.filteredData.length !== this.data.length) {
            filteredCount.textContent = `Найдено: ${this.filteredData.length}`;
            filteredCount.style.display = 'inline';
        } else {
            filteredCount.style.display = 'none';
        }
    }

    showError(message) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new PsychosomaticsApp();
});
