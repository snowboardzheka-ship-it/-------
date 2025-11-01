/*
 * Шаблонный JavaScript файл
 * Интерактивность для лендинга
 */

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollToTop();
    initSmoothScroll();
    initFormValidation();
    initScrollAnimations();
    initMobileMenu();
});

// === НАВИГАЦИЯ ===
function initNavigation() {
    const nav = document.querySelector('.navigation');
    if (!nav) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    });
}

// === МОБИЛЬНОЕ МЕНЮ ===
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Анимация кнопки гамбургера
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// === ПЛАВНАЯ ПРОКРУТКА ===
function initSmoothScroll() {
    // Находим все ссылки на секции
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем пустые ссылки
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 72; // Высота навигации
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === КНОПКА "НАВЕРХ" ===
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Прокрутка вверх при клике
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === ВАЛИДАЦИЯ ФОРМЫ ===
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Валидация
        const errors = validateForm(data);
        
        if (errors.length > 0) {
            showFormErrors(errors);
            return;
        }
        
        // Если всё ок - отправляем форму
        submitForm(data);
    });
    
    // Валидация полей при вводе
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(data) {
    const errors = [];
    
    // Проверка имени
    if (!data.name || data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Имя должно содержать минимум 2 символа' });
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push({ field: 'email', message: 'Введите корректный email адрес' });
    }
    
    // Проверка телефона (если указан)
    if (data.phone && data.phone.trim() !== '') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            errors.push({ field: 'phone', message: 'Введите корректный номер телефона' });
        }
    }
    
    // Проверка сообщения
    if (!data.message || data.message.trim().length < 10) {
        errors.push({ field: 'message', message: 'Сообщение должно содержать минимум 10 символов' });
    }
    
    return errors;
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let error = null;
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                error = 'Имя должно содержать минимум 2 символа';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Введите корректный email адрес';
            }
            break;
        case 'phone':
            if (value && value.length > 0) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    error = 'Введите корректный номер телефона';
                }
            }
            break;
        case 'message':
            if (value.length < 10) {
                error = 'Сообщение должно содержать минимум 10 символов';
            }
            break;
    }
    
    if (error) {
        showFieldError(field, error);
    } else {
        clearFieldError(field);
    }
}

function showFormErrors(errors) {
    // Очищаем старые ошибки
    clearAllErrors();
    
    // Показываем новые ошибки
    errors.forEach(error => {
        const field = document.querySelector(`[name="${error.field}"]`);
        if (field) {
            showFieldError(field, error.message);
        }
    });
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearAllErrors() {
    const errorFields = document.querySelectorAll('.form-input.error, .form-textarea.error');
    errorFields.forEach(field => {
        clearFieldError(field);
    });
}

function submitForm(data) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Показываем состояние загрузки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    // Имитируем отправку (в реальном проекте здесь будет AJAX запрос)
    setTimeout(() => {
        // Показываем успех
        showFormSuccess();
        
        // Сбрасываем форму
        document.getElementById('contact-form').reset();
        
        // Восстанавливаем кнопку
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 2000);
}

function showFormSuccess() {
    const form = document.getElementById('contact-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div style="
            background: #10b981;
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            text-align: center;
        ">
            <strong>Спасибо!</strong> Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
        </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Убираем сообщение через 5 секунд
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// === АНИМАЦИИ ПРИ СКРОЛЛЕ ===
function initScrollAnimations() {
    // Проверяем поддержку Intersection Observer
    if (!window.IntersectionObserver) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .portfolio-item,
        .about-text,
        .about-image,
        .section-header
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// === ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ===

// Функция для проверки мобильного устройства
function isMobile() {
    return window.innerWidth <= 768;
}

// Функция для дебаунса (задержки выполнения функции)
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

// Функция для throttle (ограничения частоты выполнения)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Оптимизированный обработчик скролла
const optimizedScrollHandler = throttle(function() {
    // Здесь можно добавить дополнительную логику скролла
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// === ОБРАБОТКА ОШИБОК ===
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// === КОНСОЛЬНАЯ ИНФОРМАЦИЯ ===
console.log(`
🎨 Шаблонный лендинг успешно загружен!
📱 Мобильная версия: ${isMobile() ? 'Включена' : 'Отключена'}
⚡ Интерактивность: Активна
🎯 Анимации: Включены
`);
