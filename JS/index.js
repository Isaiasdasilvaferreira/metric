(function () {
    let currentView = 'students';
    let currentData = [];
    let selectedSchoolForClasses = null;
    let selectedClassForStudents = null;
    let currentShiftFilter = 'all';

    const API_BASE_URL = '/api';

    function sanitizeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeHtml(str) {
        if (!str) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return str.replace(/[&<>"'`=/]/g, char => map[char]);
    }

    function validateAPIData(data, type) {
        if (!data) return [];
        
        let items = data;
        if (data.success && Array.isArray(data.ranking)) {
            items = data.ranking;
        }
        
        if (!Array.isArray(items)) return [];
        
        return items.filter(item => {
            if (type === 'students') {
                return item.nome && typeof item.nome === 'string' && item.nome.length > 0;
            } else if (type === 'classes') {
                return item.nome && typeof item.nome === 'string';
            } else if (type === 'schools') {
                return item.nome && typeof item.nome === 'string';
            }
            return true;
        });
    }

    async function fetchFromAPI(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar dados');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {o
            console.error('Erro de conexão');
            throw error;
        }
    }

    async function getData(type) {
        try {
            let response;
            
            if (type === 'schools') {
                response = await fetchFromAPI('/ranking_escolas');
            } else if (type === 'classes') {
                response = await fetchFromAPI('/ranking_turmas');
            } else {
                response = await fetchFromAPI('/ranking_alunos');
            }

            let data = validateAPIData(response, type);
            
            if (data.length === 0) return [];

            data.sort((a, b) => {
                const scoreA = parseInt(a.pontuacao) || parseInt(a.score) || 0;
                const scoreB = parseInt(b.pontuacao) || parseInt(b.score) || 0;
                return scoreB - scoreA;
            });
            
            const withRank = data.map((item, idx) => ({ 
                id: sanitizeHTML(String(item.id_ranking || item.id_aluno || item.id || '')),
                name: sanitizeHTML(String(item.nome || 'Sem nome')),
                school: sanitizeHTML(String(item.nome_escola || item.escola || 'Escola não informada')),
                class: sanitizeHTML(String(item.nome_turma || item.turma || 'Turma não informada')),
                shift: sanitizeHTML(String(item.turno || 'Manhã')),
                points: parseInt(item.pontuacao) || parseInt(item.points) || 0,
                score: parseInt(item.pontuacao) || parseInt(item.score) || 0,
                students: parseInt(item.quantidade_alunos) || parseInt(item.students) || 0,
                rank: idx + 1,
                supabaseId: sanitizeHTML(String(item.id_ranking || item.id_aluno || item.id || ''))
            }));
            
            return withRank;
        } catch (error) {
            console.error('Erro ao carregar dados');
            return [];
        }
    }

    function getMedalHtml(rank) {
        const validRank = parseInt(rank) || 0;
        if (validRank === 1) return '<div class="position-medal"><i class="fas fa-crown"></i></div>';
        if (validRank === 2) return '<div class="position-medal"><i class="fas fa-medal silver"></i></div>';
        if (validRank === 3) return '<div class="position-medal"><i class="fas fa-medal bronze"></i></div>';
        return `<div class="position-number">${validRank}º</div>`;
    }

    function renderStudents(data) {
        if (!Array.isArray(data)) return '<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado</p></div>';
        
        let filtered = currentShiftFilter === 'all' ? data : data.filter(item => item.shift === currentShiftFilter);
        if (!filtered.length) return '<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado</p></div>';
        
        return filtered.map(item => `
            <div class="rank-card" data-supabase-id="${escapeHtml(String(item.supabaseId || ''))}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-layer-group"></i> ${escapeHtml(item.class)}</span>
                            <span><i class="fas fa-clock"></i> ${escapeHtml(item.shift || 'Manhã')}</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.points || 0).toLocaleString()}</div>
                        <div class="rank-label">pts</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderClasses(data) {
        if (!Array.isArray(data)) return '<div class="empty-state"><i class="fas fa-chalkboard-user"></i><p>Nenhuma turma encontrada</p></div>';
        
        let filtered = [...data];
        if (selectedSchoolForClasses) filtered = filtered.filter(item => item.school === selectedSchoolForClasses);
        if (currentShiftFilter !== 'all') filtered = filtered.filter(item => item.shift === currentShiftFilter);
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        
        if (!filtered.length) return '<div class="empty-state"><i class="fas fa-chalkboard-user"></i><p>Nenhuma turma encontrada</p></div>';
        
        return filtered.map((item, idx) => `
            <div class="rank-card" data-class-name="${escapeHtml(item.name)}" data-school-name="${escapeHtml(item.school)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(idx + 1)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-users"></i> ${escapeHtml(String(item.students || 0))}</span>
                            <span><i class="fas fa-clock"></i> ${escapeHtml(item.shift || 'Manhã')}</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.score || 0).toLocaleString()}</div>
                        <div class="rank-label">score</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderSchools(data) {
        if (!Array.isArray(data) || !data.length) return '<div class="empty-state"><i class="fas fa-building"></i><p>Nenhuma escola encontrada</p></div>';
        
        return data.map(item => `
            <div class="rank-card" data-school-name="${escapeHtml(item.name)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta"><span><i class="fas fa-users"></i> ${escapeHtml(String(item.students || 0))} alunos</span></div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.score || 0).toLocaleString()}</div>
                        <div class="rank-label">pts</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async function loadRankings() {
        if (selectedClassForStudents) return;
        const container = document.getElementById('rankList');
        if (!container) return;
        
        container.textContent = '';
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i><p>Carregando...</p></div>';

        try {
            const data = await getData(currentView);
            currentData = data;
            let html = '';
            if (currentView === 'students') html = renderStudents(data);
            else if (currentView === 'classes') html = renderClasses(data);
            else html = renderSchools(data);
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar dados</p></div>';
        }
    }

    function searchByCode() {
        const query = document.getElementById('searchInput').value.trim();
        const feedback = document.getElementById('searchFeedback');
        if (!query) { 
            feedback.textContent = ''; 
            return; 
        }

        if (query.length > 50) {
            feedback.textContent = 'Código muito longo';
            feedback.className = 'search-feedback error';
            return;
        }

        const sanitizedQuery = query.replace(/[<>"'`]/g, '');
        const found = currentData.find(item => item.supabaseId === sanitizedQuery || item.cod_identificacao === sanitizedQuery);
        
        if (found) {
            feedback.textContent = `${sanitizedQuery} encontrado!`;
            feedback.className = 'search-feedback success';
            const card = document.querySelector(`.rank-card[data-supabase-id="${escapeHtml(sanitizedQuery)}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight');
                setTimeout(() => card.classList.remove('highlight'), 2000);
            }
        } else {
            feedback.textContent = 'Código não encontrado';
            feedback.className = 'search-feedback error';
        }
        setTimeout(() => { 
            feedback.textContent = ''; 
            feedback.className = 'search-feedback'; 
        }, 2500);
    }

    function init() {
        if (!document.getElementById('rankList')) {
            console.error('Elemento rankList não encontrado');
            return;
        }

        updateViewLabel();
        loadRankings();

        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentView = this.dataset.view;
                selectedSchoolForClasses = null;
                selectedClassForStudents = null;
                currentShiftFilter = 'all';
                const shiftSelect = document.getElementById('shiftFilter');
                if (shiftSelect) shiftSelect.value = 'all';
                updateViewLabel();
                loadRankings();
            });
        });

        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        if (searchBtn) searchBtn.addEventListener('click', searchByCode);
        if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchByCode(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
