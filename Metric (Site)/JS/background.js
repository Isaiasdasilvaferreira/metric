(function() {
    function createMathEquations() {
        const container = document.getElementById('mathBackground');
        if (!container) return;
        
        const formulas = [
            'E = mc²', '∫ f(x) dx', 'Σ n²', 'π ≈ 3.14', 'e^iπ + 1 = 0',
            '√-1 = i', 'φ = 1.618', 'Δ = b² - 4ac', 'sin²θ + cos²θ = 1',
            'lim x→0', 'log₂ 8 = 3', 'd/dx e^x', 'F = ma', 'v = λf',
            'a² + b² = c²', '∑ 1/n²'
        ];
        
        const sizes = ['eq-small', 'eq-medium', 'eq-large', 'eq-math'];
        const positions = [];
        
        for (let i = 0; i < 24; i++) {
            const div = document.createElement('div');
            div.className = 'math-equation';
            const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
            div.classList.add(sizeClass);
            
            const formula = formulas[Math.floor(Math.random() * formulas.length)];
            div.textContent = formula;
            
            let leftPos;
            let attempts = 0;
            let overlapping = true;
            
            do {
                leftPos = Math.random() * 85 + 5;
                overlapping = false;
                for (let j = 0; j < positions.length; j++) {
                    if (Math.abs(positions[j] - leftPos) < 10) {
                        overlapping = true;
                        break;
                    }
                }
                attempts++;
                if (attempts > 40) break;
            } while (overlapping);
            
            positions.push(leftPos);
            
            const duration = 22 + Math.random() * 18;
            const delay = Math.random() * 20;
            const drift = -20 + Math.random() * 40;
            const rotation = -4 + Math.random() * 8;
            
            div.style.left = leftPos + '%';
            div.style.animationDuration = duration + 's';
            div.style.animationDelay = delay + 's';
            div.style.setProperty('--drift', drift + 'px');
            div.style.setProperty('--rotation', rotation + 'deg');
            
            container.appendChild(div);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMathEquations);
    } else {
        createMathEquations();
    }
})();