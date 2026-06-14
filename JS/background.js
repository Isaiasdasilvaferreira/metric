(function() {
    function createMathBackground() {
        const container = document.getElementById('mathBackground');
        if (!container) return;
        
        const formulas = [
            'E = mc²', '∫ f(x)dx', 'Σ n²', 'π ≈ 3.14', 'e^iπ + 1 = 0',
            '√-1 = i', 'φ = 1.618', 'Δ = b² - 4ac', 'sin²θ + cos²θ = 1',
            'lim x→0', 'log₂ 8 = 3', 'd/dx eˣ', 'F = ma', 'v = λf',
            'a² + b² = c²', '∑ 1/n²', '∇ · E = ρ/ε'
        ];
        
        const sizes = ['eq-small', 'eq-medium', 'eq-large', 'eq-math'];
        const positions = [];
        
        const count = window.innerWidth < 768 ? 20 : 30;
        
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'math-equation';
            const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
            div.classList.add(sizeClass);
            div.textContent = formulas[Math.floor(Math.random() * formulas.length)];
            
            let leftPos;
            let attempts = 0;
            do {
                leftPos = Math.random() * 85 + 5;
                let overlapping = false;
                for (let j = 0; j < positions.length; j++) {
                    if (Math.abs(positions[j] - leftPos) < 10) {
                        overlapping = true;
                        break;
                    }
                }
                if (!overlapping) break;
                attempts++;
                if (attempts > 30) break;
            } while (true);
            
            positions.push(leftPos);
            
            const duration = 18 + Math.random() * 20;
            const delay = Math.random() * 15;
            const drift = -20 + Math.random() * 40;
            const rotation = -5 + Math.random() * 10;
            
            div.style.left = leftPos + '%';
            div.style.animationDuration = duration + 's';
            div.style.animationDelay = delay + 's';
            div.style.setProperty('--drift', drift + 'px');
            div.style.setProperty('--rotation', rotation + 'deg');
            
            container.appendChild(div);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMathBackground);
    } else {
        createMathBackground();
    }
})();