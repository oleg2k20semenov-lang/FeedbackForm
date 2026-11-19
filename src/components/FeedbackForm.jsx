import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  // 1. Состояния для значений полей
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // 2. Состояние для ошибок (изначально ошибок нет — null)
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    message: null,
  });

  // 3. Состояние "тронутых" полей (чтобы не ругать пользователя, пока он печатает)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  // 4. Состояния для процесса отправки
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- ФУНКЦИИ ВАЛИДАЦИИ ---
  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    // Регулярное выражение: только буквы (рус/англ), пробелы и дефис
    if (!/^[a-zA-Zа-яёЁ\s-]+$/.test(value.trim())) return "Только буквы, пробелы и дефис";
    return null; // Если ошибки нет, возвращаем null
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email обязателен для заполнения";
    // Простая проверка на наличие @ и точки
    if (!/^\S+@\S+\.\S+$/.test(value.trim())) return "Некорректный формат email";
    return null;
  };

  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    return null;
  };

  const validators = {
    name: validateName,
    email: validateEmail,
    message: validateMessage,
  };

  // --- ОБРАБОТЧИКИ ---

  // Обработчик ввода (срабатывает при каждом нажатии клавиши)
  const handleChange = (field, value) => {
    switch (field) {
      case "name": setName(value); break;
      case "email": setEmail(value); break;
      case "message": setMessage(value); break;
      default: break;
    }

    // Если поле уже было "тронуто" (пользователь из него выходил), 
    // то валидируем прямо на лету и обновляем ошибку.
    // Оператор ...prev копирует старые ошибки, чтобы не потерять их для других полей!
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  // Обработчик потери фокуса (когда кликаем в другое место)
  const handleBlur = (field) => {
    // Помечаем поле как тронутое
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Достаем текущее значение и проверяем его
    const currentValue = field === "name" ? name : field === "email" ? email : message;
    
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](currentValue),
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // Отменяем стандартную перезагрузку страницы

    // Проверяем ВСЕ поля разом
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true }); // Помечаем всё тронутым

    // Если хотя бы одна ошибка не null — прерываем отправку
    if (Object.values(newErrors).some((err) => err !== null)) {
      return; 
    }

    // Имитируем отправку на сервер (задержка 1.5 сек)
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true); // Показываем экран "Спасибо"
    }, 1500);
  };

  // --- УСЛОВНЫЙ РЕНДЕРИНГ (Экран успеха) ---
  if (submitted) {
    return (
      <div className="feedback-form feedback-form-success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">Мы свяжемся с вами в ближайшее время.</p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            // Сбрасываем всё в исходное состояние
            setName(""); setEmail(""); setMessage("");
            setErrors({ name: null, email: null, message: null });
            setTouched({ name: false, email: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  // --- ОСНОВНОЙ JSX (Сама форма) ---
  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      {/* Поле Имя */}
      <div className="field">
        <label htmlFor="name" className="field__label">Имя</label>
        <input
          id="name"
          type="text"
          // Добавляем класс ошибки, если поле тронуто И есть ошибка (для красной рамки)
          className={`field__input ${touched.name && errors.name ? 'field__input--error' : ''}`}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {/* Показываем текст ошибки только если поле тронуто и есть ошибка */}
        {touched.name && errors.name && <span className="field__error">{errors.name}</span>}
      </div>

      {/* Поле Email */}
      <div className="field">
        <label htmlFor="email" className="field__label">Email</label>
        <input
          id="email"
          type="email"
          className={`field__input ${touched.email && errors.email ? 'field__input--error' : ''}`}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && <span className="field__error">{errors.email}</span>}
      </div>

      {/* Поле Сообщение */}
      <div className="field">
        <label htmlFor="message" className="field__label">Сообщение</label>
        <textarea
          id="message"
          className={`field__input ${touched.message && errors.message ? 'field__input--error' : ''}`}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
        />
        {touched.message && errors.message && <span className="field__error">{errors.message}</span>}
      </div>

      <button type="submit" className="feedback-form__submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;