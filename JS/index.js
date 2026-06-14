(function () {
    let currentView = 'students';
    let currentData = [];
    let selectedSchoolForClasses = null;
    let selectedClassForStudents = null;
    let currentShiftFilter = 'all';

    const API_BASE_URL = '/api';

    async function fetchFromAPI(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
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

            let data = response;
            if (response && response.success && response.ranking) {
                data = response.ranking;
            }

            if (data && data.length) {
                if (type === 'students') {
                    const escolas = await fetchFromAPI('/escolas');
                    const turmas = await fetchFromAPI('/turmas');
                    
                    const escolasMap = {};
                    if (escolas && escolas.length) {
                        escolas.forEach(e => { escolasMap[e.id_escola] = e.nome; });
                    }
                    
                    const turmasMap = {};
                    if (turmas && turmas.length) {
                        turmas.forEach(t => { turmasMap[t.id_turma] = t.nome; });
                    }
                    
                    data = data.map(item => ({
                        ...item,
                        nome_escola: escolasMap[item.id_escola] || 'Escola não informada',
                        nome_turma: turmasMap[item.id_turma] || 'Turma não informada'
                    }));
                }

                data.sort((a, b) => (b.pontuacao || b.score || b.points || 0) - (a.pontuacao || a.score || a.points || 0));
                const withRank = data.map((item, idx) => ({ 
                    id: item.id_ranking || item.id_aluno || item.id,
                    name: item.nome || item.name || 'Sem nome',
                    school: item.nome_escola || item.escola || 'Escola não informada',
                    class: item.nome_turma || item.turma || 'Turma não informada',
                    shift: item.turno || 'Manhã',
                    points: item.pontuacao || item.points || 0,
                    score: item.pontuacao || item.score || 0,
                    students: item.quantidade_alunos || item.students || 0,
                    rank: idx + 1,
                    supabaseId: item.id_ranking || item.id_aluno || item.id,
                    cod_identificacao: item.cod_identificacao || ''
                }));
                return withRank;
            }
            
            return [];
        } catch (error) {
            console.error(`Erro ao carregar ${type}:`, error);
            return [];
        }
    }

    function getMedalHtml(rank) {
        if (rank === 1) return '<div class="position-medal"><i class="fas fa-crown"></i></div>';
        if (rank === 2) return '<div class="position-medal"><i class="fas fa-medal silver"></i></div>';
        if (rank === 3) return '<div class="position-medal"><i class="fas fa-medal bronze"></i></div>';
        return `<div class="position-number">${rank}º</div>`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function renderStudents(data) {
        let filtered = currentShiftFilter === 'all' ? data : data.filter(item => item.shift === currentShiftFilter);
        if (!filtered.length) return `<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado</p></div>`;
        return filtered.map(item => `
            <div class="rank-card" data-supabase-id="${item.id || item.ID}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-layer-group"></i> ${escapeHtml(item.class)}</span>
                            <span><i class="fas fa-clock"></i> ${item.shift}</span>
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
        let filtered = [...data];
        if (selectedSchoolForClasses) filtered = filtered.filter(item => item.school === selectedSchoolForClasses);
        if (currentShiftFilter !== 'all') filtered = filtered.filter(item => item.shift === currentShiftFilter);
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        if (!filtered.length) return `<div class="empty-state"><i class="fas fa-chalkboard-user"></i><p>Nenhuma turma encontrada</p></div>`;
        return filtered.map((item, idx) => `
            <div class="rank-card" data-class-name="${escapeHtml(item.name)}" data-school-name="${escapeHtml(item.school)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(idx + 1)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-users"></i> ${item.students || 0}</span>
                            <span><i class="fas fa-clock"></i> ${item.shift}</span>
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
        if (!data.length) return `<div class="empty-state"><i class="fas fa-building"></i><p>Nenhuma escola encontrada</p></div>`;
        return data.map(item => `
            <div class="rank-card" data-school-name="${escapeHtml(item.name)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta"><span><i class="fas fa-users"></i> ${item.students || 0} alunos</span></div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.score || 0).toLocaleString()}</div>
                        <div class="rank-label">pts</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function updateViewLabel() {
        const labels = { students: 'de Alunos', classes: 'de Turmas', schools: 'de Escolas' };
        document.getElementById('rankLabel').innerText = labels[currentView];
        document.getElementById('searchInput').value = '';
        document.getElementById('searchFeedback').innerHTML = '';
        document.getElementById('classDetailsPanel').style.display = 'none';
        document.querySelector('.ranking-scroll-area').style.display = 'block';
        if (currentView !== 'classes') {
            selectedSchoolForClasses = null;
            document.getElementById('schoolClassesFilter').style.display = 'none';
            document.getElementById('shiftFilterContainer').style.display = 'none';
        } else {
            document.getElementById('shiftFilterContainer').style.display = 'block';
        }
    }

    async function loadRankings() {
        const container = document.getElementById('rankList');
        container.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i><p>Carregando...</p></div>`;
        const data = await getData(currentView);
        currentData = data;
        let html = '';
        if (currentView === 'students') html = renderStudents(data);
        else if (currentView === 'classes') html = renderClasses(data);
        else html = renderSchools(data);
        container.innerHTML = html;
    }

    function searchByCode() {
        const query = document.getElementById('searchInput').value.trim();
        const feedback = document.getElementById('searchFeedback');
        if (!query) { feedback.innerHTML = ''; return; }

        const found = currentData.find(item => 
            String(item.supabaseId) === query || 
            String(item.cod_identificacao) === query ||
            String(item.id) === query
        );
        
        if (found) {
            feedback.innerHTML = `<i class="fas fa-check-circle"></i> ${query} encontrado!`;
            feedback.className = 'search-feedback success';
            const card = document.querySelector(`.rank-card[data-supabase-id="${found.id || found.supabaseId}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight');
                setTimeout(() => card.classList.remove('highlight'), 2000);
            }
        } else {
            feedback.innerHTML = `<i class="fas fa-exclamation-circle"></i> Código não encontrado`;
            feedback.className = 'search-feedback error';
        }
        setTimeout(() => { feedback.innerHTML = ''; feedback.className = 'search-feedback'; }, 2500);
    }

    function init() {
        updateViewLabel();
        loadRankings();
        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentView = this.dataset.view;
                selectedSchoolForClasses = null;
                currentShiftFilter = 'all';
                updateViewLabel();
                loadRankings();
            });
        });
        document.getElementById('searchBtn').addEventListener('click', searchByCode);
        document.getElementById('searchInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') searchByCode(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

document.addEventListener('click', function(e) {
    const link = e.target.closest('.footer-links a[data-modal]');
    if (link) {
        e.preventDefault();
        const modalId = link.dataset.modal + 'Modal';
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    if (e.target.classList.contains('info-widget-close')) {
        const modal = e.target.closest('.info-widget-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    if (e.target.classList.contains('info-widget-modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.info-widget-modal').forEach(function(modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});
