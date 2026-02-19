/**
 * LANDING PAGE - CONTROLE SUA MENTE
 * PARADOXE ABYSS
 * JavaScript para interações e animações
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // INICIALIZAÇÃO DO AOS (Animate On Scroll)
    // ============================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            // Configurações globais
            offset: 120,          // offset (em px) do ponto de disparo original
            delay: 0,             // valores de 0 a 3000, com passo 50ms
            duration: 800,        // valores de 0 a 3000, com passo 50ms
            easing: 'ease-out-cubic', // easing padrão para animações AOS
            once: true,           // se a animação deve acontecer apenas uma vez
            mirror: false,        // se os elementos devem animar ao rolar para fora
            anchorPlacement: 'top-bottom', // posição de ancoragem padrão
            
            // Configurações responsivas
            disable: function() {
                // Desativa em dispositivos com prefers-reduced-motion
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Adiciona/remove classe scrolled baseado na posição
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Esconde/mostra navbar ao rolar para baixo/cima (opcional)
        if (scrollY > lastScrollY && scrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            
            // Animação do ícone do menu
            const svg = mobileMenuBtn.querySelector('svg');
            if (!isExpanded) {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
            } else {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            }
        });

        // Fecha o menu ao clicar em um link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            });
        });

        // Fecha o menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL PARA LINKS DE NAVEGAÇÃO
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // FORM HANDLING (Netlify Forms)
    // ============================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // O Netlify Forms vai lidar com o envio
            // Aqui podemos adicionar validações adicionais ou feedback visual
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (emailInput && !emailInput.value.trim()) {
                e.preventDefault();
                emailInput.focus();
                emailInput.classList.add('border-red-500');
                return;
            }
            
            // Feedback visual de envio
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                // Restaura o botão após 3 segundos (caso o Netlify não redirecione)
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });

    // ============================================
    // LAZY LOADING PARA IMAGENS
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // PARALLAX EFFECT PARA ELEMENTOS DECORATIVOS
    // ============================================
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // ============================================
    // COUNTER ANIMATION (se necessário no futuro)
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // ============================================
    // INTERSECTION OBSERVER PARA ANIMAÇÕES PERSONALIZADAS
    // ============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    // ============================================
    // TOOLTIPS (se necessário)
    // ============================================
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            const tooltipText = this.dataset.tooltip;
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            setTimeout(() => tooltip.classList.add('visible'), 10);
        });
        
        trigger.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.classList.remove('visible');
                setTimeout(() => tooltip.remove(), 300);
            }
        });
    });

    // ============================================
    // PERFORMANCE: DEBOUNCE E THROTTLE UTILITIES
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // RESIZE HANDLER OTIMIZADO
    // ============================================
    const handleResize = debounce(() => {
        // Atualiza AOS em mudanças de tamanho
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Fecha menu mobile em telas grandes
        if (window.innerWidth >= 768 && mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    // ============================================
    // CONSOLE MESSAGE (opcional)
    // ============================================
    console.log('%c🔮 PARADOXE ABYSS', 'color: #8B3A3A; font-size: 24px; font-weight: bold;');
    console.log('%cControle Sua Mente Antes Que Ela Te Controle', 'color: #CCCCCC; font-size: 14px;');

});

// ============================================
// FUNÇÕES GLOBAIS
// ============================================

/**
 * Scroll suave para um elemento específico
 * @param {string} elementId - ID do elemento alvo
 * @param {number} offset - Offset adicional (padrão: 80px)
 */
function scrollToElement(elementId, offset = 80) {
    const element = document.querySelector(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
    }
}

/**
 * Mostra uma notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'info'
 * @param {number} duration - Duração em ms
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${colors[type]};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(150%)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Verifica se o elemento está visível na viewport
 * @param {HTMLElement} element - Elemento a verificar
 * @param {number} threshold - Threshold de visibilidade (0-1)
 * @returns {boolean}
 */
function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -threshold &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Exporta funções para uso global (se necessário)
window.PARADOXE = {
    scrollToElement,
    showToast,
    isInViewport
};
