import React from 'react';

const Header = ({toggleModal, nbOfContacts, handleLogout}) => {
    return (
        <header className="header">
            <div className='container'>
                <h3>
                    Contact List ({nbOfContacts})
                </h3>
                <button onClick={() => toggleModal(true)} className='btn'>
                    <i className='bi bi-plus-square'></i> Add new contact
                </button>
                <button onClick={handleLogout} className='btn'>
                    <i className='bi bi-box-arrow-right'></i> Logout
                </button>
            </div>
        </header>
    );
};

export default Header;