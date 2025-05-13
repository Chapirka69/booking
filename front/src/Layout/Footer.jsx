import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Помощь</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Коронавирус (COVID-19): часто задаваемые вопросы
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Управлять поездками
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Связаться с нами
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Центр знаний по безопасности
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Разное</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Подать жалобу
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Сезонные предложения и специальные скидки
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Статьи о путешествиях от Booke.com для бизнеса
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Traveller Review Awards
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Правила и настройки</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Изменить настройки cookie-файлов
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Конфиденциальность и cookie-файлы
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Разрешение споров
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Противодействие торговле людьми
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Партнёрам</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Войти в Экстранет
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Центр помощи партнёрам
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Зарегистрировать свой объект
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Программа для аффилиатов
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  О Booke.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Как мы работаем
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Устойчивое развитие
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Пресс-центр
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Вакансии
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Для инвесторов
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Корпоративные контакты
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <span className="flex items-center">
            <span className="mr-1">🇷🇺</span>
            <span>EUR</span>
          </span>
        </div>

        <div className="border-t pt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              Booke.com — часть Booke Holdings Inc., мирового лидера в сфере онлайн-туризма и сопутствующих услуг
            </p>
            <p className="text-sm">
              Copyright © 1996–2025 Booke.com™. Все права защищены.
            </p>
          </div>
          <div className="flex space-x-4">
            <img src="https://via.placeholder.com/100x30?text=Booke.com" alt="Booke.com" className="h-6" />
            <img src="https://via.placeholder.com/100x30?text=Priceline" alt="Priceline" className="h-6" />
            <img src="https://via.placeholder.com/100x30?text=Kayak" alt="Kayak" className="h-6" />
            <img src="https://via.placeholder.com/100x30?text=Agoda" alt="Agoda" className="h-6" />
            <img src="https://via.placeholder.com/100x30?text=OpenTable" alt="OpenTable" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;