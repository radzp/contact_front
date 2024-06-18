import {useEffect, useRef, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header'
import ContactList from './components/ContactList'
import {getContacts, saveContact, udpateContact, udpatePhoto} from './api/ContactService';
import {Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom';
import ContactDetail from './components/ContactDetail';
import {toastError} from './api/ToastService';
import {ToastContainer} from 'react-toastify';
import {AuthProvider} from "./middleware/AuthContext.jsx";
import ProtectedRoute from "./middleware/ProtectedRoute.jsx";
import LoginSignup from "./components/loginSignup/LoginSignup.jsx";
import axios from "axios";

function App() {
    const modalRef = useRef();
    const fileRef = useRef();
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [file, setFile] = useState(undefined);
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: 'Active',
    });
    const location = useLocation();
    let navigate = useNavigate();

    const getAllContacts = async (page = 0, size = 10) => {
        try {
            setCurrentPage(page);
            const {data} = await getContacts(page, size);
            setData(data);
            console.log(data);
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const onChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    };

    const handleNewContact = async (event) => {
        event.preventDefault();
        try {
            const {data} = await saveContact(values);
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', data.id);
            const {data: photoUrl} = await udpatePhoto(formData);
            toggleModal(false);
            setFile(undefined);
            fileRef.current.value = null;
            setValues({
                name: '',
                email: '',
                phone: '',
                address: '',
                title: '',
                status: 'Active',
            })
            getAllContacts();
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };


    const updateContact = async (contact) => {
        try {
            const {data} = await udpateContact(contact);
            console.log(data);
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const updateImage = async (formData) => {
        try {
            const {data: photoUrl} = await udpatePhoto(formData);
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };


    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/logout', {}, {withCredentials: true});
            navigate('/login');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    }



    const toggleModal = show => show ? modalRef.current.showModal() : modalRef.current.close();

    useEffect(() => {
        getAllContacts();
    }, []);

    return (
        <AuthProvider>
            {location.pathname !== '/login' && <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} handleLogout={handleLogout} />}
            <main className='main'>
                <div className={location.pathname !== '/login' ? 'container' : ''}>
                    <Routes>
                        <Route path='/login' element={<LoginSignup/>}/>
                        <Route path="/" element={<ProtectedRoute/>}>
                            <Route path='/' element={<Navigate to={'/contacts'}/>}/>
                            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage}
                                                                          getAllContacts={getAllContacts}/>}/>
                            <Route path="/contacts/:id" element={<ContactDetail updateContact={updateContact}
                                                                                updateImage={updateImage}
                                                                                getAllContacts={getAllContacts}/>}/>
                        </Route>
                    </Routes>
                </div>
            </main>

            {/* Modal */}
            <dialog ref={modalRef} className="modal" id="modal">
                <div className="modal__header">
                    <h3>New Contact</h3>
                    <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
                </div>
                <div className="divider"></div>
                <div className="modal__body">
                    <form onSubmit={handleNewContact}>
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">Name</span>
                                <input type="text" value={values.name} onChange={onChange} name='name' required/>
                            </div>
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="email" value={values.email} onChange={onChange} name='email' required
                                       pattern="\S+@\S+\.\S+"/>
                            </div>
                            <div className="input-box">
                                <span className="details">Title</span>
                                <input type="text" value={values.title} onChange={onChange} name='title' required/>
                            </div>
                            <div className="input-box">
                                <span className="details">Phone Number</span>
                                <input type="tel" value={values.phone} onChange={onChange} name='phone' required
                                       pattern="[0-9]{9}"/>
                            </div>
                            <div className="input-box">
                                <span className="details">Address</span>
                                <input type="text" value={values.address} onChange={onChange} name='address' required/>
                            </div>
                            <div className="input-box">
                                <span className="details">Account Status</span>
                                <select value={values.status} onChange={onChange} name='status' required>
                                    <option value="Active" >Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="file-input">
                                <span className="details">Profile Photo</span>
                                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef}
                                       name='photo' required accept=".jpg,.jpeg,.png"/>
                            </div>
                        </div>
                        <div className="form_footer">
                            <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel
                            </button>
                            <button type='submit' className="btn">Save</button>
                        </div>
                    </form>
                </div>
            </dialog>
            <ToastContainer/>
        </AuthProvider>
    );
}

export default App;