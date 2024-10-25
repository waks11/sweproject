import React from 'react'
//import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import logoImage from './icons/uf_logo.webp'
import messageImage from './icons/message.webp'
import accountImage from './icons/account.webp'
import logoutImage from './icons/logout.webp'

const Logo = () => {
    return (
        <div>
            <img src={logoImage} alt="Logo"/>
        </div>
    );
};

const Messaging = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/messages')
    };

    return (
        <div>
            <button onClick={ handleClick }>
                <div className="filter invert w-18 h-18">
                    <img 
                        src = {messageImage} 
                        alt="Messaging icon"
                    />
                </div>
            </button>
        </div>
    );
};

const Account = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/')
    };

    return (
        <div>
            <button onClick={ handleClick }>
                <div className="filter invert w-14 h-14">
                    <img 
                        src = {accountImage} 
                        alt="Account icon"
                    />
                </div>
            </button>
        </div>
    );
};

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/')
    };

    return (
        <div>
            <button onClick={ handleClick }>
                <div className="filter invert w-16 h-16">
                    <img 
                        src = {logoutImage} 
                        alt="Logout icon"
                    />
                </div>
            </button>
        </div>
    );
};

export const SideBar = () => {
    const menuItems = [
        {component: <Messaging />, key: 'messaging'},
        {component: <Account />, key: 'account'},
        {component: <Logout />, key: 'logout'}
    ];

    return (
        <div className="fixed top-0 left-0 items-center h-screen w-20 bg-blue-800 text-white">
            <div className="my-4">
                <Logo />
            </div>
            <div className="flex-grow">
                <ul className="flex flex-col items-center space-y-4">
                    {menuItems.map(item => (
                        <li key={item.key} className="flex items-center justify-center">
                            <div className="flex items-center justify-center"> 
                                {React.cloneElement(item.component, { className: "w-full h-full" })} 
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default SideBar;

