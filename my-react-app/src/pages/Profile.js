import React from 'react';
import user from '../img/user.jpg';

const ProfilePage = ({ username, role }) => {
    return (
        <div>

            <div className="userPanel">
                <img src={user} alt="User" />
                <h2>Nickname: {username}</h2>
                <h2>Role: {role}</h2>
                <a className="loginbutton" href="/logout">
                    Log out
                </a>
            </div>
            <div className="stopka">
                <p>Biblioteka Główna Akademii Górniczo-Hutniczej im. Stanisława Staszica w Krakowie</p>
                <p>tel. +48 12 617 32 08</p>
                <p>e-mail: bgagh@bg.agh.edu.pl</p>
            </div>
        </div>
    );
};

export default ProfilePage;