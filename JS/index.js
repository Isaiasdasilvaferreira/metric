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
            data.sort((a, b) => (b.pontuacao || b.score || b.points || 0) - (a.pontuacao || a.score || a.points || 0));
            const withRank = data.map((item, idx) => ({ 
                id: item.id_ranking || item.id_aluno || item.id,
                name: item.nome || item.name || 'Sem nome',
                school: item.nome_escola || item.escola || 'ETEC de Itaquaquecetuba',
                class: item.nome_turma || item.turma || 'Desenvolvimento de Sistemas',
                shift: item.turno || 'Manhã',
                points: item.pontuacao || item.points || 0,
                score: item.pontuacao || item.score || 0,
                students: item.quantidade_alunos || item.students || 0,
                rank: idx + 1,
                supabaseId: item.id_ranking || item.id_aluno || item.id
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

    async function getClassesBySchool(schoolName) {
        try {
            const allClasses = await fetchFromAPI('/ranking_turmas');
            return allClasses.filter(c => c.school === schoolName);
        } catch (error) {
            console.error('Erro ao buscar turmas da escola:', error);
            return [];
        }
    }

    async function getStudentsByClass(className, schoolName) {
        try {
            const allStudents = await fetchFromAPI('/ranking_alunos');
            return allStudents.filter(s => s.class === className && s.school === schoolName);
        } catch (error) {
            console.error('Erro ao buscar alunos da turma:', error);
            return [];
        }
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

    async function showClassStudents(className, schoolName) {
        document.getElementById('classDetailsPanel').style.display = 'block';
        document.querySelector('.ranking-scroll-area').style.display = 'none';
        document.getElementById('shiftFilterContainer').style.display = 'none';
        document.getElementById('schoolClassesFilter').style.display = 'none';
        document.getElementById('selectedClassName').innerHTML = `${escapeHtml(className)} · ${escapeHtml(schoolName)}`;

        const studentsList = document.getElementById('classStudentsList');
        studentsList.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i><p>Carregando alunos...</p></div>`;

        const students = await getStudentsByClass(className, schoolName);

        if (students.length) {
            studentsList.innerHTML = students.map((s, idx) => `
                <div class="rank-card">
                    <div class="rank-row">
                        <div class="rank-position">${getMedalHtml(idx + 1)}</div>
                        <div class="rank-content">
                            <div class="rank-title">${escapeHtml(s.name)}</div>
                            <div class="rank-meta">
                                <span><i class="fas fa-clock"></i> ${s.shift}</span>
                                <span><i class="fas fa-id-card"></i> ${s.id || s.ID}</span>
                            </div>
                        </div>
                        <div class="rank-stats">
                            <div class="rank-score">${s.points || 0}</div>
                            <div class="rank-label">pts</div>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            studentsList.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>Nenhum aluno nesta turma</p></div>';
        }
        selectedClassForStudents = true;
    }

    function backToClasses() {
        document.getElementById('classDetailsPanel').style.display = 'none';
        document.querySelector('.ranking-scroll-area').style.display = 'block';
        if (currentView === 'classes') {
            document.getElementById('shiftFilterContainer').style.display = 'block';
            if (selectedSchoolForClasses) document.getElementById('schoolClassesFilter').style.display = 'flex';
        }
        selectedClassForStudents = null;
        loadRankings();
    }

    async function loadRankings() {
        if (selectedClassForStudents) return;
        const container = document.getElementById('rankList');
        container.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i><p>Carregando...</p></div>`;

        const data = await getData(currentView);
        currentData = data;
        let html = '';
        if (currentView === 'students') html = renderStudents(data);
        else if (currentView === 'classes') html = renderClasses(data);
        else html = renderSchools(data);
        container.innerHTML = html;

        if (currentView === 'schools') {
            document.querySelectorAll('.rank-card').forEach(card => {
                card.removeEventListener('click', card.schoolHandler);
                card.schoolHandler = () => {
                    const school = card.getAttribute('data-school-name');
                    if (school) {
                        currentView = 'classes';
                        document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
                        document.querySelector('[data-view="classes"]').classList.add('active');
                        updateViewLabel();
                        updateClassFilterBySchool(school);
                        loadRankings();
                    }
                };
                card.addEventListener('click', card.schoolHandler);
            });
        }

        if (currentView === 'classes') {
            document.querySelectorAll('.rank-card').forEach(card => {
                card.removeEventListener('click', card.classHandler);
                card.classHandler = () => {
                    const className = card.getAttribute('data-class-name');
                    const schoolName = card.getAttribute('data-school-name');
                    if (className && schoolName) showClassStudents(className, schoolName);
                };
                card.addEventListener('click', card.classHandler);
            });
        }
    }

    async function updateClassFilterBySchool(schoolName) {
        const classFilter = document.getElementById('classBySchoolFilter');
        const filterContainer = document.getElementById('schoolClassesFilter');
        const selectedSpan = document.getElementById('selectedSchoolName');
        
        classFilter.innerHTML = '<option value="all">Carregando turmas...</option>';
        
        if (schoolName) {
            const classes = await getClassesBySchool(schoolName);
            classFilter.innerHTML = '<option value="all">Todas as turmas</option>';
            classes.forEach(cls => {
                const opt = document.createElement('option');
                opt.value = cls.name;
                opt.textContent = `${cls.name} (${cls.shift})`;
                classFilter.appendChild(opt);
            });
            filterContainer.style.display = 'flex';
            selectedSpan.innerHTML = `${schoolName}`;
            selectedSchoolForClasses = schoolName;
        } else {
            classFilter.innerHTML = '<option value="all">Todas as turmas</option>';
            filterContainer.style.display = 'none';
            selectedSchoolForClasses = null;
        }
        loadRankings();
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
            if (selectedSchoolForClasses) document.getElementById('schoolClassesFilter').style.display = 'flex';
        }
    }

    function searchByCode() {
        const query = document.getElementById('searchInput').value.trim().toUpperCase();
        const feedback = document.getElementById('searchFeedback');
        if (!query) { feedback.innerHTML = ''; return; }

        let formatted = query;
        if (currentView === 'students' && !query.startsWith('STD-')) formatted = 'STD-' + query.padStart(3, '0');
        else if (currentView === 'classes' && !query.startsWith('CLS-')) formatted = 'CLS-' + query.padStart(3, '0');
        else if (currentView === 'schools' && !query.startsWith('SCH-')) formatted = 'SCH-' + query.padStart(3, '0');

        const found = currentData.find(item => item.supabaseId === formatted);
        if (found) {
            feedback.innerHTML = `<i class="fas fa-check-circle"></i> ${formatted} encontrado!`;
            feedback.className = 'search-feedback success';
            const card = document.querySelector(`.rank-card[data-supabase-id="${formatted}"]`);
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
                selectedClassForStudents = null;
                currentShiftFilter = 'all';
                const shiftSelect = document.getElementById('shiftFilter');
                if (shiftSelect) shiftSelect.value = 'all';
                updateViewLabel();
                loadRankings();
            });
        });

        document.getElementById('searchBtn').addEventListener('click', searchByCode);
        document.getElementById('searchInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') searchByCode(); });
        document.getElementById('classBySchoolFilter').addEventListener('change', () => loadRankings());
        document.getElementById('backToClassesBtn').addEventListener('click', backToClasses);
        document.getElementById('shiftFilter').addEventListener('change', (e) => { currentShiftFilter = e.target.value; loadRankings(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.info-widget-modal');
    const footerLinks = document.querySelectorAll('.footer-links a[data-modal]');

    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.dataset.modal + 'Modal';
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.info-widget-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
    });
});
