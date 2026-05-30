(function() {
    const STORAGE_KEY = 'metric_rankings_cache';
    const CACHE_DURATION = 5 * 60 * 1000;
    
    let currentView = 'students';
    let currentData = [];
    
    const supabaseData = {
        students: [
            { id: 'STD-001', name: 'Ana Beatriz Silva', class: '3º Ano A', school: 'Escola Metric Paulista', points: 1245 },
            { id: 'STD-002', name: 'Lucas Gabriel Costa', class: '2º Ano C', school: 'Escola Metric Paulista', points: 1198 },
            { id: 'STD-003', name: 'Mariana Fernandes', class: '3º Ano B', school: 'Metric Advanced School', points: 1156 },
            { id: 'STD-004', name: 'Rafael Oliveira', class: '1º Ano A', school: 'Escola Metric Paulista', points: 1087 },
            { id: 'STD-005', name: 'Camila Rodrigues', class: '2º Ano A', school: 'Metric Excellence Institute', points: 1043 },
            { id: 'STD-006', name: 'Thiago Martins', class: '3º Ano C', school: 'Metric Advanced School', points: 987 },
            { id: 'STD-007', name: 'Beatriz Lima', class: '2º Ano B', school: 'Metric Academy Center', points: 923 },
            { id: 'STD-008', name: 'Felipe Araújo', class: '1º Ano B', school: 'Metric Excellence Institute', points: 876 },
            { id: 'STD-009', name: 'Isabela Costa', class: '3º Ano D', school: 'Metric Tech Institute', points: 812 },
            { id: 'STD-010', name: 'Gustavo Pereira', class: '2º Ano D', school: 'Metric Global School', points: 754 }
        ],
        classes: [
            { id: 'CLS-001', name: '3º Ano A - Engenharia', school: 'Escola Metric Paulista', students: 32, score: 1245 },
            { id: 'CLS-002', name: '2º Ano C - Data Science', school: 'Escola Metric Paulista', students: 28, score: 1198 },
            { id: 'CLS-003', name: '3º Ano B - IA', school: 'Metric Advanced School', students: 30, score: 1156 },
            { id: 'CLS-004', name: '1º Ano A - Computação', school: 'Escola Metric Paulista', students: 35, score: 1087 },
            { id: 'CLS-005', name: '2º Ano A - Robótica', school: 'Metric Excellence Institute', students: 26, score: 1043 },
            { id: 'CLS-006', name: '3º Ano C - Software', school: 'Metric Advanced School', students: 29, score: 987 },
            { id: 'CLS-007', name: '2º Ano B - Blockchain', school: 'Metric Academy Center', students: 24, score: 923 },
            { id: 'CLS-008', name: '1º Ano B - Design', school: 'Metric Excellence Institute', students: 31, score: 876 },
            { id: 'CLS-009', name: '3º Ano D - Games', school: 'Metric Tech Institute', students: 27, score: 812 },
            { id: 'CLS-010', name: '2º Ano D - Cloud', school: 'Metric Global School', students: 33, score: 754 }
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
    
    function getLocalCache() {
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (!cached) return null;
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp > CACHE_DURATION) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return data.value;
        } catch {
            return null;
        }
    }
    
    function setLocalCache(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                timestamp: Date.now(),
                value: data
            }));
        } catch {}
    }
    
    function getData(type) {
        const cache = getLocalCache();
        if (cache && cache[type]) {
            return Promise.resolve(cache[type]);
        }
        
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
                
                sourceData.sort((a, b) => (b.score || b.points || 0) - (a.score || a.points || 0));
                sourceData = sourceData.slice(0, 15);
                
                const withRank = sourceData.map((item, idx) => ({ 
                    ...item, 
                    rank: idx + 1,
                    supabaseId: item.id
                }));
                
                const newCache = getLocalCache() || {};
                newCache[type] = withRank;
                setLocalCache(newCache);
                
                resolve(withRank);
            }, 200);
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
        return `<div class="position-number">${rank}</div>`;
    }
    
    function renderSchools(data) {
        return data.map(item => `
            <div class="rank-card" data-supabase-id="${item.supabaseId}">
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
        return data.map(item => `
            <div class="rank-card" data-supabase-id="${item.supabaseId}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-user-friends"></i> ${item.students} alunos</span>
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
        return data.map(item => `
            <div class="rank-card" data-supabase-id="${item.supabaseId}">
                <div class="rank-row">
                    <div class="rank-position">${getMedalHtml(item.rank)}</div>
                    <div class="rank-content">
                        <div class="rank-title">${escapeHtml(item.name)}</div>
                        <div class="rank-meta">
                            <span><i class="fas fa-school"></i> ${escapeHtml(item.school)}</span>
                            <span><i class="fas fa-layer-group"></i> ${escapeHtml(item.class)}</span>
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
    
    async function loadRankings() {
        const container = document.getElementById('rankList');
        container.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i><p>Carregando rankings...</p></div>`;
        
        try {
            const data = await getData(currentView);
            currentData = data;
            
            if (!data || data.length === 0) {
                container.innerHTML = `<div class="empty-state"><i class="fas fa-chart-line"></i><p>Nenhum dado disponível</p></div>`;
                return;
            }
            
            let html = '';
            if (currentView === 'students') html = renderStudents(data);
            else if (currentView === 'classes') html = renderClasses(data);
            else html = renderSchools(data);
            
            container.innerHTML = html;
            
            document.querySelectorAll('.rank-card').forEach(card => {
                card.addEventListener('click', function() {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => { this.style.transform = ''; }, 150);
                });
            });
        } catch (error) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar os dados.</p></div>`;
        }
    }
    
    function updateViewLabel() {
        const labels = { students: 'de Alunos', classes: 'de Turmas', schools: 'de Escolas' };
        document.getElementById('rankLabel').textContent = labels[currentView];
        document.getElementById('searchInput').value = '';
        document.getElementById('searchFeedback').innerHTML = '';
        document.getElementById('searchFeedback').className = 'search-feedback';
        
        let placeholder = '';
        if (currentView === 'students') placeholder = 'Buscar por código (ex: STD-001)';
        else if (currentView === 'classes') placeholder = 'Buscar por código (ex: CLS-001)';
        else placeholder = 'Buscar por código (ex: SCH-001)';
        document.getElementById('searchInput').placeholder = placeholder;
    }
    
    function init() {
        updateViewLabel();
        loadRankings();
        
        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentView = this.dataset.view;
                updateViewLabel();
                loadRankings();
            });
        });
        
        document.getElementById('searchBtn').addEventListener('click', searchByCode);
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchByCode();
        });
    }
    
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();