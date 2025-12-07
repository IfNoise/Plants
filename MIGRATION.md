# Миграция на переменные среды

## Что было сделано

Проект успешно переведен с использования пакета `config` на переменные среды с помощью `dotenv`.

## Изменения

### Файлы конфигурации

1. **Создан `.env`** - файл с переменными окружения для локальной разработки
2. **Создан `.env.example`** - шаблон для переменных окружения (без секретных данных)
3. **Обновлен `.gitignore`** - добавлены файлы `.env*` для исключения из Git

### Измененные файлы кода

1. **app.js**
   - Добавлен `require('dotenv').config()` в начало файла
   - `config.get("port")` → `process.env.PORT`
   - `config.get('mongodbUri')` → `process.env.MONGODB_URI`

2. **controllers/Auth.js**
   - Удален импорт `config`
   - `config.get("jwtSecret")` → `process.env.JWT_SECRET`

3. **routes/auth.routes.js**
   - Удален импорт `config`
   - `config.get("jwtSecret")` → `process.env.JWT_SECRET`

4. **middlewares/auth.middleware.js**
   - Удален импорт `config`
   - `config.get("jwtSecret")` → `process.env.JWT_SECRET`

5. **package.json**
   - Удалена зависимость `config`
   - Пакет `dotenv` уже был установлен

### Старые файлы конфигурации (можно удалить)

- `config/default.json`
- `config/production.json`
- Папка `config/` (если больше не содержит других файлов)

## Переменные среды

### Обязательные переменные

```env
# Порт сервера
PORT=5000

# Подключение к MongoDB
MONGODB_URI=mongodb://localhost:27017/plants

# Секретный ключ для JWT
JWT_SECRET=your_secret_key_here

# Базовый URL приложения
BASE_URL=http://localhost:5000

# Окружение
NODE_ENV=development
```

## Инструкция по развертыванию

### Для разработки

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Отредактируйте `.env` и установите нужные значения

3. Запустите приложение:
   ```bash
   npm run dev
   ```

### Для продакшена

1. Создайте файл `.env` на сервере или используйте системные переменные окружения

2. Установите переменные:
   ```bash
   export PORT=5000
   export MONGODB_URI=mongodb://your-mongodb-server:27017/plants
   export JWT_SECRET=your_very_secure_secret_key
   export BASE_URL=https://yourdomain.com
   export NODE_ENV=production
   ```

3. Или используйте `.env` файл и запустите:
   ```bash
   npm start
   ```

## Важные замечания

⚠️ **Безопасность:**
- Никогда не коммитьте файл `.env` в Git
- Используйте надежные секретные ключи в продакшене
- Файл `.env.example` должен содержать только примеры без реальных секретов

✅ **Преимущества новой системы:**
- Более гибкая конфигурация для разных окружений
- Стандартный подход, используемый большинством Node.js приложений
- Проще интеграция с Docker, Kubernetes и другими инструментами
- Секреты не хранятся в коде
