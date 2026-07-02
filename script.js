// ОБРОБКА ФОРМИ ЗАМОВЛЕННЯ
document.getElementById('orderForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const quantity = document.getElementById('quantity').value;
  const description = document.getElementById('description').value;

  // Формування повідомлення для Telegram
  const telegramMessage = `
🛍️ *Нове замовлення на PrintMug*

👤 *Ім'я:* ${name}
📱 *Телефон:* ${phone}
✉️ *Email:* ${email || 'не вказано'}
🎁 *Кількість чашок:* ${quantity}
📝 *Дизайн:* ${description}
  `.trim();

  // Альтернативні способи відправки
  // 1. Telegram
  const telegramBotToken = 'YOUR_BOT_TOKEN'; // Замініть на ваш токен
  const telegramChatId = 'YOUR_CHAT_ID'; // Замініть на ваш ID чату

  // 2. Viber
  const viberUrl = `viber://chat?number=%2B38XXXXXXXXX&text=${encodeURIComponent(telegramMessage)}`;

  // 3. Email (через формсервіс)
  const emailBody = `
Нове замовлення:
Ім'я: ${name}
Телефон: ${phone}
Email: ${email}
Кількість чашок: ${quantity}
Опис замовлення: ${description}
  `;

  // Показуємо успішне повідомлення
  alert(`✅ Дякуємо, ${name}!\n\nВаше замовлення прийняте. Ми незабаром з вами зв'яжемося.\n\n📞 Телефон: +38 (0XX) XXX-XX-XX\n📱 Telegram: @printmug`);

  // Очищуємо форму
  this.reset();

  // Опціонально: відправляємо на бекенд
  // fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, phone, email, quantity, description })
  // });
});

// АНІМАЦІЯ ПРИ СКРОЛЮВАННІ
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// АНІМУЄМО КАРТИ ПОСЛУГ
document.querySelectorAll('.service-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.6s ease';
  observer.observe(card);
});

// ПЛАВНА ПРОКРУТКА
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ДИНАМІЧНІ СОЦІАЛЬНІ ПОСИЛАННЯ (замініть на реальні)
const socialLinks = {
  telegram: 'https://t.me/printmug', // Замініть на ваш Telegram
  viber: 'viber://chat?number=%2B38XXXXXXXXX', // Замініть на ваш номер
  instagram: 'https://instagram.com/printmug' // Замініть на ваш Instagram
};

// ФОРМАТУВАННЯ НОМЕРА ТЕЛЕФОНУ
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.length <= 2) {
        value = '+' + value;
      } else if (value.length <= 5) {
        value = '+' + value.slice(0, 2) + ' (' + value.slice(2);
      } else if (value.length <= 8) {
        value = '+' + value.slice(0, 2) + ' (' + value.slice(2, 5) + ') ' + value.slice(5);
      } else if (value.length <= 10) {
        value = '+' + value.slice(0, 2) + ' (' + value.slice(2, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8);
      } else {
        value = '+' + value.slice(0, 2) + ' (' + value.slice(2, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8, 10) + '-' + value.slice(10, 12);
      }
      e.target.value = value;
    }
  });
}

// СЧЕТЧИК ДЛЯ КІЛЬКОСТІ ЧАШОК
const quantityInput = document.getElementById('quantity');
if (quantityInput) {
  quantityInput.addEventListener('change', function() {
    if (this.value < 1) this.value = 1;
  });
}

console.log('✅ PrintMug сайт завантажено успішно!');
