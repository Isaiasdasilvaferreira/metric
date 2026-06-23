(function () {
    let currentView = 'students';
    let currentData = [];
    let selectedSchoolId = null;        
    let selectedSchoolName = null;      
    let selectedClassId = null;         
    let selectedClassName = null;       
    let currentShiftFilter = 'all';
    let lastClassesData = [];

    const API_BASE_URL = '/api';

    function normalizeId(value) {
        return value === undefined || value === null ? '' : String(value).trim();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
        });
    }

    function getMedalHtml(rank) {
        if (rank === 1) return '<div class="position-medal"><i class="fas fa-crown"></i></div>';
        if (rank === 2) return '<div class="position-medal"><i class="fas fa-medal silver"></i></div>';
        if (rank === 3) return '<div class="position-medal"><i class="fas fa-medal bronze"></i></div>';
        return `<div class="position-number">${rank}º</div>`;
    }

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

    function normalizeStudent(item, idx) {
        const schoolId  = normalizeId(item.id_escola  || item.escolaId  || item.schoolId);
        const classId   = normalizeId(item.id_turma   || item.turmaId   || item.classId);
        const schoolName = item.nome_escola || item.nomeEscola || item.escola || item.school || '';
        const className  = item.nome_turma  || item.nomeTurma  || item.turma  || item.class  || '';

        const hasValidSchool = Boolean(schoolId && schoolName);
        const hasValidClass  = Boolean(classId  && className);

        if (!hasValidSchool || !hasValidClass) {
            console.warn(
                `[Metric] Aluno sem escola/turma válida (idx ${idx}):`,
                { id: item.id_ranking || item.id_aluno || item.id, schoolId, classId, schoolName, className }
            );
        }

        return {
            id:         normalizeId(item.id_ranking || item.id_aluno || item.id),
            schoolId,
            classId,
            name:       item.nome || item.name || 'Sem nome',
            school:     schoolName || '⚠ Escola não informada',
            class:      className  || '⚠ Turma não informada',
            shift:      item.turno || item.periodo || 'Manhã',
            points:     item.pontuacao || item.points || 0,
            score:      item.pontuacao || item.score  || 0,
            rank:       idx + 1,
            hasValidSchool,
            hasValidClass,
        };
    }

    function normalizeClass(item, idx) {
        const schoolId  = normalizeId(item.id_escola  || item.escolaId  || item.schoolId);
        const classId   = normalizeId(item.id_turma   || item.turmaId   || item.classId);
        const schoolName = item.nome_escola || item.nomeEscola || item.escola || item.school || '';
        const className  = item.nome_turma  || item.nomeTurma  || item.turma  || item.class || item.nome || item.name || '';

        return {
            id:       classId  || normalizeId(item.id),
            schoolId,
            classId,
            name:     className  || '⚠ Turma sem nome',
            school:   schoolName || '⚠ Escola não informada',
            shift:    item.turno || item.periodo || 'Manhã',
            score:    item.pontuacao || item.desempenho || item.score || item.points || 0,
            students: item.quantidade_alunos || item.students || 0,
            rank:     idx + 1,
        };
    }

    function normalizeSchool(item, idx) {
        const schoolId   = normalizeId(item.id_escola || item.escolaId || item.schoolId || item.id);
        const schoolName = item.nome_escola || item.nomeEscola || item.escola || item.school || item.nome || item.name || '';

        return {
            id:       schoolId,
            schoolId,
            name:     schoolName || '⚠ Escola sem nome',
            shift:    item.turno || item.periodo || 'Manhã',
            score:    item.pontuacao || item.desempenho || item.score || item.points || 0,
            students: item.quantidade_alunos || item.students || 0,
            rank:     idx + 1,
        };
    }

    async function getData(type) {
        try {
            let endpoint;
            if      (type === 'schools') endpoint = '/ranking_escolas';
            else if (type === 'classes') endpoint = '/ranking_turmas';
            else                         endpoint = '/ranking';

            let response = await fetchFromAPI(endpoint);
            let data = (response && response.success && response.ranking) ? response.ranking : response;

            if (!Array.isArray(data) || !data.length) return [];

            data.sort((a, b) =>
                (b.pontuacao || b.desempenho || b.score || b.points || 0) -
                (a.pontuacao || a.desempenho || a.score || a.points || 0)
            );

            if (type === 'schools') return data.map(normalizeSchool);
            if (type === 'classes') return data.map(normalizeClass);
            return data.map(normalizeStudent); // students

        } catch (error) {
            console.error(`Erro ao carregar ${type}:`, error);
            return [];
        }
    }

    function renderStudents(data) {
        let filtered = currentShiftFilter === 'all'
            ? data
            : data.filter(item => item.shift === currentShiftFilter);

        if (!filtered.length)
            return `<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado</p></div>`;

        return filtered.map(item => `
            <div class="rank-card" data-id="${escapeHtml(item.id)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-layer-group"></i> ${escapeHtml(item.class)}</span>
                            <span><i class="fas fa-clock"></i> ${escapeHtml(item.shift)}</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.points || 0).toLocaleString('pt-BR')}</div>
                        <div class="rank-label">pts</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderClasses(data) {
        let filtered = [...data];

        if (selectedSchoolId)
            filtered = filtered.filter(item => item.schoolId === selectedSchoolId);

        if (currentShiftFilter !== 'all')
            filtered = filtered.filter(item => item.shift === currentShiftFilter);

        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        filtered.forEach((item, idx) => { item.rank = idx + 1; });

        if (!filtered.length)
            return `<div class="empty-state"><i class="fas fa-chalkboard-user"></i><p>Nenhuma turma encontrada</p></div>`;

        return filtered.map(item => `
            <div class="rank-card"
                 data-class-id="${escapeHtml(item.classId)}"
                 data-school-id="${escapeHtml(item.schoolId)}"
                 data-class-name="${escapeHtml(item.name)}"
                 data-school-name="${escapeHtml(item.school)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-users"></i> ${item.students || 0} alunos</span>
                            <span><i class="fas fa-clock"></i> ${escapeHtml(item.shift)}</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.score || 0).toLocaleString('pt-BR')}</div>
                        <div class="rank-label">pts</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderSchools(data) {
        if (!data.length)
            return `<div class="empty-state"><i class="fas fa-building"></i><p>Nenhuma escola encontrada</p></div>`;

        return data.map(item => `
            <div class="rank-card" data-school-id="${escapeHtml(item.schoolId)}" data-school-name="${escapeHtml(item.name)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-users"></i> ${item.students || 0} alunos</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.score || 0).toLocaleString('pt-BR')}</div>
                        <div class="rank-label">pts</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderClassStudents(studentsData) {
        let filtered = studentsData.filter(item =>
            item.schoolId === selectedSchoolId &&
            item.classId  === selectedClassId
        );

        if (currentShiftFilter !== 'all')
            filtered = filtered.filter(item => item.shift === currentShiftFilter);

        filtered.sort((a, b) => (b.points || 0) - (a.points || 0));

        if (!filtered.length)
            return `<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado nesta turma</p></div>`;

        return filtered.map((item, idx) => `
            <div class="rank-card" data-id="${escapeHtml(item.id)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(idx + 1)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-layer-group"></i> ${escapeHtml(item.class)}</span>
                            <span><i class="fas fa-clock"></i> ${escapeHtml(item.shift)}</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.points || 0).toLocaleString('pt-BR')}</div>
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
            selectedSchoolId   = null;
            selectedSchoolName = null;
            document.getElementById('schoolClassesFilter').style.display  = 'none';
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
        if (currentView === 'classes') lastClassesData = data;

        let html = '';
        if      (currentView === 'students') html = renderStudents(data);
        else if (currentView === 'classes')  html = renderClasses(data);
        else                                 html = renderSchools(data);

        container.innerHTML = html;
    }

    function setActiveView(view) {
        currentView = view;
        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        updateViewLabel();
    }

    function populateClassFilter(classesData) {
        const select = document.getElementById('classBySchoolFilter');
        const classes = classesData
            .filter(item => !selectedSchoolId || item.schoolId === selectedSchoolId)
            .map(item => ({ id: item.classId, name: item.name }))
            .filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i)
            .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        select.innerHTML = '<option value="all">Todas as turmas</option>' +
            classes.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join('');
    }

    async function openSchoolClasses(schoolId, schoolName) {
        selectedSchoolId   = schoolId;
        selectedSchoolName = schoolName;
        selectedClassId    = null;
        selectedClassName  = null;
        currentShiftFilter = 'all';

        setActiveView('classes');
        document.getElementById('selectedSchoolName').innerText = schoolName;
        document.getElementById('schoolClassesFilter').style.display  = 'block';
        document.getElementById('shiftFilterContainer').style.display = 'block';
        document.getElementById('classDetailsPanel').style.display    = 'none';
        document.querySelector('.ranking-scroll-area').style.display  = 'block';

        await loadRankings();
        populateClassFilter(lastClassesData);
    }

    async function openClassStudents(classId, className, schoolId, schoolName) {
        selectedClassId    = classId;
        selectedClassName  = className;
        selectedSchoolId   = schoolId;
        selectedSchoolName = schoolName;

        document.getElementById('selectedClassName').innerText = `${className} — ${schoolName}`;
        document.getElementById('classDetailsPanel').style.display   = 'block';
        document.querySelector('.ranking-scroll-area').style.display = 'none';

        const students = await getData('students');
        document.getElementById('classStudentsList').innerHTML = renderClassStudents(students);
    }

    function backToClasses() {
        selectedClassId   = null;
        selectedClassName = null;
        document.getElementById('classDetailsPanel').style.display   = 'none';
        document.querySelector('.ranking-scroll-area').style.display = 'block';
    }

    function searchByCode() {
        const query    = document.getElementById('searchInput').value.trim().toUpperCase();
        const feedback = document.getElementById('searchFeedback');
        if (!query) { feedback.innerHTML = ''; return; }

        const found = currentData.find(item =>
            normalizeId(item.id).toUpperCase() === query
        );

        if (found) {
            feedback.innerHTML   = `<i class="fas fa-check-circle"></i> ${escapeHtml(query)} encontrado!`;
            feedback.className   = 'search-feedback success';
        } else {
            feedback.innerHTML   = `<i class="fas fa-exclamation-circle"></i> Código não encontrado`;
            feedback.className   = 'search-feedback error';
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
                currentView        = this.dataset.view;
                selectedSchoolId   = null;
                selectedSchoolName = null;
                selectedClassId    = null;
                selectedClassName  = null;
                currentShiftFilter = 'all';
                updateViewLabel();
                loadRankings();
            });
        });

        document.getElementById('searchBtn').addEventListener('click', searchByCode);
        document.getElementById('searchInput').addEventListener('keypress', e => {
            if (e.key === 'Enter') searchByCode();
        });

        document.getElementById('backToClassesBtn').addEventListener('click', backToClasses);

        document.getElementById('classBySchoolFilter').addEventListener('change', function () {
            if (this.value === 'all') {
                selectedClassId   = null;
                selectedClassName = null;
                document.getElementById('rankList').innerHTML = renderClasses(lastClassesData);
                document.getElementById('classDetailsPanel').style.display   = 'none';
                document.querySelector('.ranking-scroll-area').style.display = 'block';
            } else {
                const classId   = this.value;
                const classItem = lastClassesData.find(c => c.classId === classId && c.schoolId === selectedSchoolId);
                const className = classItem ? classItem.name : classId;
                openClassStudents(classId, className, selectedSchoolId, selectedSchoolName);
            }
        });

        document.getElementById('shiftFilter').addEventListener('change', function () {
            currentShiftFilter = this.value;
            if (selectedClassId) {
                openClassStudents(selectedClassId, selectedClassName, selectedSchoolId, selectedSchoolName);
            } else if (currentView === 'classes') {
                document.getElementById('rankList').innerHTML = renderClasses(lastClassesData);
            } else {
                loadRankings();
            }
        });

        document.getElementById('rankList').addEventListener('click', function (e) {
            if (currentView === 'schools') {
                const card = e.target.closest('.rank-card[data-school-id]');
                if (card) {
                    openSchoolClasses(card.dataset.schoolId, card.dataset.schoolName);
                }
                return;
            }

            if (currentView === 'classes') {
                const card = e.target.closest('.rank-card[data-class-id]');
                if (card) {
                    openClassStudents(
                        card.dataset.classId,
                        card.dataset.className,
                        card.dataset.schoolId,
                        card.dataset.schoolName
                    );
                }
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

document.addEventListener('click', function (e) {
    const link = e.target.closest('.footer-links a[data-modal]');
    if (link) {
        e.preventDefault();
        const modal = document.getElementById(link.dataset.modal + 'Modal');
        if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    }

    if (e.target.classList.contains('info-widget-close')) {
        const modal = e.target.closest('.info-widget-modal');
        if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
    }

    if (e.target.classList.contains('info-widget-modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.info-widget-modal').forEach(m => {
            m.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});
