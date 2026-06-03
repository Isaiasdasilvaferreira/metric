(function() {
    const STORAGE_KEY = 'metric_rankings_cache';
    const CACHE_DURATION = 5 * 60 * 1000;
    
    let currentView = 'students';
    let currentData = [];
    let selectedSchoolForClasses = null;
    let selectedClassForStudents = null;
    let currentShiftFilter = 'all';
    
    const supabaseData = {
        students: [
            { id: 'STD-001', name: 'Ana Beatriz Silva', class: '3º Ano A', school: 'Escola Metric Paulista', shift: 'Manhã', points: 1245 },
            { id: 'STD-002', name: 'Lucas Gabriel Costa', class: '2º Ano C', school: 'Escola Metric Paulista', shift: 'Tarde', points: 1198 },
            { id: 'STD-003', name: 'Mariana Fernandes', class: '3º Ano B', school: 'Metric Advanced School', shift: 'Manhã', points: 1156 },
            { id: 'STD-004', name: 'Rafael Oliveira', class: '1º Ano A', school: 'Escola Metric Paulista', shift: 'Noite', points: 1087 },
            { id: 'STD-005', name: 'Camila Rodrigues', class: '2º Ano A', school: 'Metric Excellence Institute', shift: 'Tarde', points: 1043 },
            { id: 'STD-006', name: 'Thiago Martins', class: '3º Ano C', school: 'Metric Advanced School', shift: 'Noite', points: 987 },
            { id: 'STD-007', name: 'Beatriz Lima', class: '2º Ano B', school: 'Metric Academy Center', shift: 'Manhã', points: 923 },
            { id: 'STD-008', name: 'Felipe Araújo', class: '1º Ano B', school: 'Metric Excellence Institute', shift: 'Tarde', points: 876 },
            { id: 'STD-009', name: 'Isabela Costa', class: '3º Ano D', school: 'Metric Tech Institute', shift: 'Integral', points: 812 },
            { id: 'STD-010', name: 'Gustavo Pereira', class: '2º Ano D', school: 'Metric Global School', shift: 'Manhã', points: 754 },
            { id: 'STD-011', name: 'Sofia Mendes', class: '3º Ano A', school: 'Escola Metric Paulista', shift: 'Tarde', points: 1320 },
            { id: 'STD-012', name: 'Leonardo Costa', class: '2º Ano C', school: 'Escola Metric Paulista', shift: 'Noite', points: 1100 },
            { id: 'STD-013', name: 'Juliana Santos', class: '1º Ano A', school: 'Escola Metric Paulista', shift: 'Manhã', points: 980 },
            { id: 'STD-014', name: 'Bruno Lima', class: '3º Ano B', school: 'Metric Advanced School', shift: 'Tarde', points: 1090 },
            { id: 'STD-015', name: 'Patrícia Rocha', class: '2º Ano A', school: 'Metric Excellence Institute', shift: 'Integral', points: 1010 }
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
            { id: 'CLS-009', name: '3º Ano D', school: 'Metric Tech Institute', shift: 'Integral', students: 27, score: 812 },
            { id: 'CLS-010', name: '2º Ano D', school: 'Metric Global School', shift: 'Manhã', students: 33, score: 754 }
        ],
        schools: [
            { id: 'SCH-001', name: 'Escola Metric Paulista', students: 1240, score: 9845 },
            { id: 'SCH-002', name: 'Metric Advanced School', students: 980, score: 8723 },
            { id: 'SCH-003', name: 'Metric Excellence Institute', students: 756, score: 7654 },
            { id: 'SCH-004', name: 'Metric Academy Center', students: 892, score: 6987 },
            { id: 'SCH-005', name: 'Metric Tech Institute', students: 645, score: 6123 },
            { id: 'SCH-006', name: 'Metric Global School', students: 1123, score: 5543 },
            { id: 'SCH-007', name: 'Metric Digital Campus', students: 678, score: 4876 },
            { id: 'SCH-008', name: 'Metric Future Lab', students: 534, score: 4234 },
            { id: 'SCH-009', name: 'Metric Innovation Hub', students: 487, score: 3654 },
            { id: 'SCH-010', name: 'Metric Next Academy', students: 398, score: 2987 }
        ]
    };
    
    // Função simplificada para dados locais (sem cache problemático)
    function getData(type) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let sourceData = [];
                if (type === 'schools') {
                    sourceData = supabaseData.schools.map(item => ({ ...item }));
                } else if (type === 'classes') {
                    sourceData = supabaseData.classes.map(item => ({ ...item }));
                } else {
                    sourceData = supabaseData.students.map(item => ({ ...item }));
                }
                
                // Ordenar por pontuação
                sourceData.sort((a, b) => (b.score || b.points || 0) - (a.score || a.points || 0));
                
                const withRank = sourceData.map((item, idx) => ({ 
                    ...item, 
                    rank: idx + 1,
                    supabaseId: item.id
                }));
                
                resolve(withRank);
            }, 100);
        });
    }
    
    function getMedalHtml(rank) {
        if (rank === 1) {
            return '<div class="position-medal"><i class="fas fa-crown"></i></div>';
        }
        if (rank === 2) {
            return '<div class="position-medal"><i class="fas fa-medal silver"></i></div>';
        }
        if (rank === 3) {
            return '<div class="position-medal"><i class="fas fa-medal bronze"></i></div>';
        }
        return `<div class="position-number">${rank}º</div>`;
    }
    
    function getClassesBySchool(schoolName) {
        return supabaseData.classes.filter(c => c.school === schoolName);
    }
    
    function applyShiftFilter(data) {
        if (currentShiftFilter === 'all') return data;
        return data.filter(item => item.shift === currentShiftFilter);
    }
    
    function getStudentsByClass(className, schoolName) {
        return supabaseData.students.filter(s => s.class === className && s.school === schoolName);
    }
    
    function renderStudentsFromClass(className, schoolName, students) {
        const sortedStudents = [...students].sort((a, b) => b.points - a.points);
        
        if (sortedStudents.length === 0) {
            return `<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado nesta turma.</p></div>`;
        }
        
        return sortedStudents.map((student, idx) => `
            <div class="rank-card" data-supabase-id="${student.id}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(idx + 1)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(student.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(student.school)}</span>
                            <span><i class="fas fa-clock"></i> ${escapeHtml(student.shift)}</span>
                            <span><i class="fas fa-id-card"></i> ${student.id}</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${student.points.toLocaleString()}</div>
                        <div class="rank-label">pontos</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function renderSchools(data) {
        if (!data || data.length === 0) {
            return `<div class="empty-state"><i class="fas fa-building"></i><p>Nenhuma escola encontrada.</p></div>`;
        }
        
        return data.map(item => `
            <div class="rank-card" data-supabase-id="${item.supabaseId}" data-school-name="${escapeHtml(item.name)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-users"></i> ${item.students} alunos</span>
                        </div>
                    </div>
                    <div class="rank-stats">
                        <div class="rank-score">${(item.score || 0).toLocaleString()}</div>
                        <div class="rank-label">pontos</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function renderClasses(data) {
        let filteredData = [...data];
        
        if (selectedSchoolForClasses) {
            filteredData = filteredData.filter(item => item.school === selectedSchoolForClasses);
        }
        
        filteredData = applyShiftFilter(filteredData);
        
        if (filteredData.length === 0) {
            return `<div class="empty-state"><i class="fas fa-chalkboard-user"></i><p>Nenhuma turma encontrada.</p></div>`;
        }
        
        // Reordenar após filtros
        filteredData.sort((a, b) => b.score - a.score);
        
        return filteredData.map((item, idx) => `
            <div class="rank-card" data-supabase-id="${item.supabaseId}" data-class-name="${escapeHtml(item.name)}" data-school-name="${escapeHtml(item.school)}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(idx + 1)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-user-friends"></i> ${item.students} alunos</span>
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
    
    function renderStudents(data) {
        let filteredData = applyShiftFilter(data);
        
        if (filteredData.length === 0) {
            return `<div class="empty-state"><i class="fas fa-user-graduate"></i><p>Nenhum aluno encontrado para o turno selecionado.</p></div>`;
        }
        
        return filteredData.map(item => `
            <div class="rank-card" data-supabase-id="${item.supabaseId}">
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
                        <div class="rank-label">pontos</div>
                    </div>
                </div>
            </div>
        `).join('');
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
    
    function scrollToCard(id) {
        const card = document.querySelector(`.rank-card[data-supabase-id="${id}"]`);
        if (card) {
            document.querySelectorAll('.rank-card').forEach(c => c.classList.remove('highlight'));
            card.classList.add('highlight');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                card.classList.remove('highlight');
            }, 3000);
            return true;
        }
        return false;
    }
    
    function searchByCode() {
        const searchInput = document.getElementById('searchInput');
        const feedback = document.getElementById('searchFeedback');
        let query = searchInput.value.trim().toUpperCase();
        
        if (!query) {
            feedback.innerHTML = '';
            feedback.className = 'search-feedback';
            return;
        }
        
        if (!query.startsWith('STD-') && !query.startsWith('CLS-') && !query.startsWith('SCH-')) {
            if (currentView === 'students') query = 'STD-' + query.padStart(3, '0');
            else if (currentView === 'classes') query = 'CLS-' + query.padStart(3, '0');
            else query = 'SCH-' + query.padStart(3, '0');
        }
        
        const found = currentData.some(item => item.supabaseId === query);
        
        if (found) {
            feedback.innerHTML = `<i class="fas fa-check-circle"></i> Código ${query} encontrado!`;
            feedback.className = 'search-feedback success';
            scrollToCard(query);
        } else {
            feedback.innerHTML = `<i class="fas fa-exclamation-circle"></i> Código ${query} não encontrado.`;
            feedback.className = 'search-feedback error';
        }
        
        setTimeout(() => {
            if (feedback.className !== 'search-feedback') {
                setTimeout(() => {
                    feedback.innerHTML = '';
                    feedback.className = 'search-feedback';
                }, 3000);
            }
        }, 4000);
    }
    
    function updateClassFilterBySchool(schoolName) {
        const classFilter = document.getElementById('classBySchoolFilter');
        const filterContainer = document.getElementById('schoolClassesFilter');
        const selectedSchoolSpan = document.getElementById('selectedSchoolName');
        
        if (!classFilter) return;
        
        classFilter.innerHTML = '<option value="all">Todas as turmas</option>';
        
        if (schoolName) {
            const classes = getClassesBySchool(schoolName);
            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.name;
                option.textContent = `${cls.name} (${cls.shift})`;
                classFilter.appendChild(option);
            });
            
            filterContainer.style.display = 'flex';
            selectedSchoolSpan.textContent = `Escola: ${schoolName}`;
            selectedSchoolForClasses = schoolName;
        } else {
            filterContainer.style.display = 'none';
            selectedSchoolForClasses = null;
        }
    }
    
    function onClassFilterChange() {
        const classFilter = document.getElementById('classBySchoolFilter');
        const selectedClassName = classFilter.value;
        
        if (!selectedSchoolForClasses) return;
        
        loadRankings(); // Recarrega com o filtro
    }
    
    function showClassStudents(className, schoolName) {
        const students = getStudentsByClass(className, schoolName);
        const classDetailsPanel = document.getElementById('classDetailsPanel');
        const rankingScrollArea = document.querySelector('.ranking-scroll-area');
        const shiftFilterContainer = document.getElementById('shiftFilterContainer');
        const schoolClassesFilter = document.getElementById('schoolClassesFilter');
        const selectedClassNameSpan = document.getElementById('selectedClassName');
        const classStudentsList = document.getElementById('classStudentsList');
        
        selectedClassNameSpan.textContent = `${className} - ${schoolName}`;
        classStudentsList.innerHTML = renderStudentsFromClass(className, schoolName, students);
        
        if (shiftFilterContainer) shiftFilterContainer.style.display = 'none';
        if (schoolClassesFilter) schoolClassesFilter.style.display = 'none';
        if (rankingScrollArea) rankingScrollArea.style.display = 'none';
        classDetailsPanel.style.display = 'block';
        
        selectedClassForStudents = { className, schoolName };
    }
    
    function backToClasses() {
        const classDetailsPanel = document.getElementById('classDetailsPanel');
        const rankingScrollArea = document.querySelector('.ranking-scroll-area');
        const shiftFilterContainer = document.getElementById('shiftFilterContainer');
        const schoolClassesFilter = document.getElementById('schoolClassesFilter');
        
        classDetailsPanel.style.display = 'none';
        if (rankingScrollArea) rankingScrollArea.style.display = 'block';
        
        if (currentView === 'classes') {
            if (shiftFilterContainer) shiftFilterContainer.style.display = 'flex';
            if (schoolClassesFilter && selectedSchoolForClasses) {
                schoolClassesFilter.style.display = 'flex';
            }
        }
        
        selectedClassForStudents = null;
        loadRankings();
    }
    
    function attachClassClickEvents() {
        document.querySelectorAll('.rank-card').forEach(card => {
            // Remove eventos anteriores para evitar duplicação
            card.removeEventListener('click', card.clickHandler);
            card.clickHandler = (e) => {
                if (e.target.closest('a')) return;
                
                card.style.transform = 'scale(0.98)';
                setTimeout(() => { card.style.transform = ''; }, 150);
                
                if (currentView === 'classes') {
                    const className = card.getAttribute('data-class-name');
                    const schoolName = card.getAttribute('data-school-name');
                    if (className && schoolName) {
                        showClassStudents(className, schoolName);
                    }
                }
            };
            card.addEventListener('click', card.clickHandler);
        });
    }
    
    async function loadRankings() {
        const container = document.getElementById('rankList');
        const classDetailsPanel = document.getElementById('classDetailsPanel');
        const shiftFilterContainer = document.getElementById('shiftFilterContainer');
        const schoolClassesFilter = document.getElementById('schoolClassesFilter');
        const rankingScrollArea = document.querySelector('.ranking-scroll-area');
        
        if (selectedClassForStudents) {
            return;
        }
        
        if (rankingScrollArea) rankingScrollArea.style.display = 'block';
        if (classDetailsPanel) classDetailsPanel.style.display = 'none';
        
        if (container) {
            container.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i><p>Carregando rankings...</p></div>`;
        }
        
        if (shiftFilterContainer) {
            shiftFilterContainer.style.display = currentView === 'classes' ? 'flex' : 'none';
        }
        
        if (schoolClassesFilter && currentView !== 'classes') {
            schoolClassesFilter.style.display = 'none';
        }
        
        try {
            const data = await getData(currentView);
            currentData = data;
            
            if (!data || data.length === 0) {
                if (container) {
                    container.innerHTML = `<div class="empty-state"><i class="fas fa-chart-line"></i><p>Nenhum dado disponível</p></div>`;
                }
                return;
            }
            
            let html = '';
            if (currentView === 'students') {
                html = renderStudents(data);
            } else if (currentView === 'classes') {
                // Aplica filtro de turma específica se houver
                let filteredData = [...data];
                const classFilter = document.getElementById('classBySchoolFilter');
                const selectedClassName = classFilter ? classFilter.value : 'all';
                
                if (selectedSchoolForClasses) {
                    filteredData = filteredData.filter(item => item.school === selectedSchoolForClasses);
                }
                
                if (selectedClassName && selectedClassName !== 'all') {
                    filteredData = filteredData.filter(item => item.name === selectedClassName);
                }
                
                filteredData = applyShiftFilter(filteredData);
                filteredData.sort((a, b) => b.score - a.score);
                
                html = renderClasses(filteredData);
            } else {
                html = renderSchools(data);
            }
            
            if (container) {
                container.innerHTML = html;
            }
            
            // Eventos para escolas
            if (currentView === 'schools') {
                document.querySelectorAll('.rank-card').forEach(card => {
                    card.removeEventListener('click', card.schoolClickHandler);
                    card.schoolClickHandler = (e) => {
                        if (e.target.closest('a')) return;
                        
                        card.style.transform = 'scale(0.98)';
                        setTimeout(() => { card.style.transform = ''; }, 150);
                        
                        const schoolName = card.getAttribute('data-school-name');
                        if (schoolName) {
                            currentView = 'classes';
                            document.querySelectorAll('.nav-link').forEach(btn => {
                                btn.classList.remove('active');
                                if (btn.dataset.view === 'classes') {
                                    btn.classList.add('active');
                                }
                            });
                            updateViewLabel();
                            updateClassFilterBySchool(schoolName);
                            loadRankings();
                        }
                    };
                    card.addEventListener('click', card.schoolClickHandler);
                });
            }
            
            // Eventos para turmas
            if (currentView === 'classes') {
                attachClassClickEvents();
            }
            
        } catch (error) {
            console.error('Erro ao carregar rankings:', error);
            if (container) {
                container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar os dados.</p></div>`;
            }
        }
    }
    
    function updateViewLabel() {
        const labels = { students: 'de Alunos', classes: 'de Turmas', schools: 'de Escolas' };
        const labelElement = document.getElementById('rankLabel');
        if (labelElement) labelElement.textContent = labels[currentView];
        
        const searchInput = document.getElementById('searchInput');
        const feedback = document.getElementById('searchFeedback');
        if (searchInput) searchInput.value = '';
        if (feedback) {
            feedback.innerHTML = '';
            feedback.className = 'search-feedback';
        }
        
        if (currentView !== 'classes') {
            selectedSchoolForClasses = null;
            const filterContainer = document.getElementById('schoolClassesFilter');
            if (filterContainer) filterContainer.style.display = 'none';
        }
        
        selectedClassForStudents = null;
        const classDetailsPanel = document.getElementById('classDetailsPanel');
        if (classDetailsPanel) classDetailsPanel.style.display = 'none';
        const rankList = document.getElementById('rankList');
        if (rankList) rankList.style.display = 'flex';
    }
    
    function init() {
        console.log('Inicializando aplicação...');
        updateViewLabel();
        loadRankings();
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(btn => {
            btn.addEventListener('click', function() {
                navLinks.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentView = this.dataset.view;
                selectedSchoolForClasses = null;
                selectedClassForStudents = null;
                updateViewLabel();
                loadRankings();
            });
        });
        
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', searchByCode);
        }
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') searchByCode();
            });
        }
        
        const classFilter = document.getElementById('classBySchoolFilter');
        if (classFilter) {
            classFilter.addEventListener('change', () => onClassFilterChange());
        }
        
        const backBtn = document.getElementById('backToClassesBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => backToClasses());
        }
        
        const shiftFilter = document.getElementById('shiftFilter');
        if (shiftFilter) {
            shiftFilter.addEventListener('change', (e) => {
                currentShiftFilter = e.target.value;
                loadRankings();
            });
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();