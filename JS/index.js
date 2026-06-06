(function() {
    let currentView = 'students';
    let currentData = [];
    let selectedSchoolForClasses = null;
    let selectedClassForStudents = null;
    let currentShiftFilter = 'all';
    
    const mockData = {
        students: [
            { id: 'STD-001', name: 'Ana Beatriz Silva', class: '3º Ano A', school: 'Escola Metric Paulista', shift: 'Manhã', points: 1245 },
            { id: 'STD-002', name: 'Lucas Gabriel Costa', class: '2º Ano C', school: 'Escola Metric Paulista', shift: 'Tarde', points: 1198 },
            { id: 'STD-003', name: 'Mariana Fernandes', class: '3º Ano B', school: 'Metric Advanced School', shift: 'Manhã', points: 1156 },
            { id: 'STD-004', name: 'Rafael Oliveira', class: '1º Ano A', school: 'Escola Metric Paulista', shift: 'Noite', points: 1087 },
            { id: 'STD-005', name: 'Camila Rodrigues', class: '2º Ano A', school: 'Metric Excellence Institute', shift: 'Tarde', points: 1043 },
            { id: 'STD-006', name: 'Thiago Martins', class: '3º Ano C', school: 'Metric Advanced School', shift: 'Noite', points: 987 },
            { id: 'STD-007', name: 'Beatriz Lima', class: '2º Ano B', school: 'Metric Academy Center', shift: 'Manhã', points: 923 },
            { id: 'STD-008', name: 'Felipe Araújo', class: '1º Ano B', school: 'Metric Excellence Institute', shift: 'Tarde', points: 876 },
            { id: 'STD-009', name: 'Isabela Costa', class: '3º Ano D', school: 'Metric Tech Institute', shift: 'Manhã', points: 812 },
            { id: 'STD-010', name: 'Gustavo Pereira', class: '2º Ano D', school: 'Metric Global School', shift: 'Manhã', points: 754 },
            { id: 'STD-011', name: 'Sofia Mendes', class: '3º Ano A', school: 'Escola Metric Paulista', shift: 'Tarde', points: 1320 },
            { id: 'STD-012', name: 'Leonardo Costa', class: '2º Ano C', school: 'Escola Metric Paulista', shift: 'Noite', points: 1100 },
            { id: 'STD-013', name: 'Juliana Santos', class: '1º Ano A', school: 'Escola Metric Paulista', shift: 'Manhã', points: 980 },
            { id: 'STD-014', name: 'Bruno Lima', class: '3º Ano B', school: 'Metric Advanced School', shift: 'Tarde', points: 1090 },
            { id: 'STD-015', name: 'Patrícia Rocha', class: '2º Ano A', school: 'Metric Excellence Institute', shift: 'Manhã', points: 1010 }
        ],
        classes: [
            { id: 'CLS-001', name: '3º Ano A', school: 'Escola Metric Paulista', shift: 'Manhã', students: 32, score: 1245 },
            { id: 'CLS-002', name: '2º Ano C', school: 'Escola Metric Paulista', shift: 'Tarde', students: 28, score: 1198 },
            { id: 'CLS-003', name: '3º Ano B', school: 'Metric Advanced School', shift: 'Manhã', students: 30, score: 1156 },
            { id: 'CLS-004', name: '1º Ano A', school: 'Escola Metric Paulista', shift: 'Noite', students: 35, score: 1087 },
            { id: 'CLS-005', name: '2º Ano A', school: 'Metric Excellence Institute', shift: 'Tarde', students: 26, score: 1043 },
            { id: 'CLS-006', name: '3º Ano C', school: 'Metric Advanced School', shift: 'Noite', students: 29, score: 987 },
            { id: 'CLS-007', name: '2º Ano B', school: 'Metric Academy Center', shift: 'Manhã', students: 24, score: 923 },
            { id: 'CLS-008', name: '1º Ano B', school: 'Metric Excellence Institute', shift: 'Tarde', students: 31, score: 876 },
            { id: 'CLS-009', name: '3º Ano D', school: 'Metric Tech Institute', shift: 'Manhã', students: 27, score: 812 },
            { id: 'CLS-010', name: '2º Ano D', school: 'Metric Global School', shift: 'Manhã', students: 33, score: 754 }
        ],
        schools: [
            { id: 'SCH-001', name: 'Escola Metric Paulista', students: 1240, score: 9845 },
            { id: 'SCH-002', name: 'Metric Advanced School', students: 980, score: 8723 },
            { id: 'SCH-003', name: 'Metric Excellence Institute', students: 756, score: 7654 },
            { id: 'SCH-004', name: 'Metric Academy Center', students: 892, score: 6987 },
            { id: 'SCH-005', name: 'Metric Tech Institute', students: 645, score: 6123 },
            { id: 'SCH-006', name: 'Metric Global School', students: 1123, score: 5543 }
        ]
    };
    
    function getData(type) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let source = [];
                if (type === 'schools') source = [...mockData.schools];
                else if (type === 'classes') source = [...mockData.classes];
                else source = [...mockData.students];
                
                source.sort((a, b) => (b.score || b.points || 0) - (a.score || a.points || 0));
                const withRank = source.map((item, idx) => ({ ...item, rank: idx + 1, supabaseId: item.id }));
                resolve(withRank);
            }, 30);
        });
    }
    
    function getMedalHtml(rank) {
        if (rank === 1) return '<div class="position-medal"><i class="fas fa-crown"></i></div>';
        if (rank === 2) return '<div class="position-medal"><i class="fas fa-medal silver"></i></div>';
        if (rank === 3) return '<div class="position-medal"><i class="fas fa-medal bronze"></i></div>';
        return `<div class="position-number">${rank}º</div>`;
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    function getClassesBySchool(schoolName) {
        return mockData.classes.filter(c => c.school === schoolName);
    }
    
    function getStudentsByClass(className, schoolName) {
        return mockData.students.filter(s => s.class === className && s.school === schoolName);
    }
    
    function renderStudents(data) {
        let filtered = currentShiftFilter === 'all' ? data : data.filter(item => item.shift === currentShiftFilter);
        if (!filtered.length) return `<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado</p></div>`;
        return filtered.map(item => `
            <div class="rank-card" data-supabase-id="${item.id}">
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
                        <div class="rank-score">${item.points.toLocaleString()}</div>
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
        filtered.sort((a, b) => b.score - a.score);
        if (!filtered.length) return `<div class="empty-state"><i class="fas fa-chalkboard-user"></i><p>Nenhuma turma encontrada</p></div>`;
        return filtered.map((item, idx) => `
            <div class="rank-card" data-class-name="${escapeHtml(item.name)}" data-school-name="${escapeHtml(item.school)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(idx + 1)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-users"></i> ${item.students}</span>
                            <span><i class="fas fa-clock"></i> ${item.shift}</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${item.score.toLocaleString()}</div>
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
                        <div class="rank-meta"><span><i class="fas fa-users"></i> ${item.students} alunos</span></div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${item.score.toLocaleString()}</div>
                        <div class="rank-label">pts</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function showClassStudents(className, schoolName) {
        const students = getStudentsByClass(className, schoolName);
        document.getElementById('classDetailsPanel').style.display = 'block';
        document.querySelector('.ranking-scroll-area').style.display = 'none';
        document.getElementById('shiftFilterContainer').style.display = 'none';
        document.getElementById('schoolClassesFilter').style.display = 'none';
        document.getElementById('selectedClassName').innerHTML = `${escapeHtml(className)} · ${escapeHtml(schoolName)}`;
        
        if (students.length) {
            document.getElementById('classStudentsList').innerHTML = students.map((s, idx) => `
                <div class="rank-card">
                    <div class="rank-row">
                        <div class="rank-position">${getMedalHtml(idx+1)}</div>
                        <div class="rank-content">
                            <div class="rank-title">${escapeHtml(s.name)}</div>
                            <div class="rank-meta">
                                <span><i class="fas fa-clock"></i> ${s.shift}</span>
                                <span><i class="fas fa-id-card"></i> ${s.id}</span>
                            </div>
                        </div>
                        <div class="rank-stats">
                            <div class="rank-score">${s.points}</div>
                            <div class="rank-label">pts</div>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            document.getElementById('classStudentsList').innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>Nenhum aluno nesta turma</p></div>';
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
    
    function updateClassFilterBySchool(schoolName) {
        const classFilter = document.getElementById('classBySchoolFilter');
        const filterContainer = document.getElementById('schoolClassesFilter');
        const selectedSpan = document.getElementById('selectedSchoolName');
        classFilter.innerHTML = '<option value="all">Todas as turmas</option>';
        if (schoolName) {
            const classes = getClassesBySchool(schoolName);
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
            btn.addEventListener('click', function() {
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