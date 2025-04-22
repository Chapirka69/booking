import React from 'react';

function Header() {
    return (
        <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">Booke.com</h1>
            </div>
            <div className="flex items-center space-x-4">
                <span className="flex items-center">
                    <span className="mr-1">EUR</span>
                    <span className="fi fi-ru"></span>
                </span>
                <button className="hover:underline">Войти в аккаунт</button>
            </div>
        </nav>
    );
}

export default Header;