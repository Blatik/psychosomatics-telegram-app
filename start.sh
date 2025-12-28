#!/bin/bash

echo "Запуск приложения Психосоматика..."

# Проверяем наличие виртуального окружения
if [ ! -d "venv" ]; then
    echo "Создание виртуального окружения..."
    python3 -m venv venv
fi

# Активируем виртуальное окружение
source venv/bin/activate

# Устанавливаем зависимости
echo "Установка зависимостей..."
pip install -r server/requirements.txt

# Запускаем сервер
echo "Запуск сервера на http://localhost:5000"
cd server && python app.py
