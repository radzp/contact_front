import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {deleteContact, getContact} from '../api/ContactService';
import {toastError, toastSuccess} from '../api/ToastService';

const ContactDetail = ({updateContact, updateImage, getAllContacts}) => {
    const inputRef = useRef();
    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
        photoUrl: ''
    });
    let navigate = useNavigate();

    const {id} = useParams();

    const fetchContact = async (id) => {
        try {
            const {data} = await getContact(id);
            setContact(data);
            console.log(data);
            //toastSuccess('Contact retrieved');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const onDeleteContact = async (event) => {
        event.preventDefault();
        try {
            await deleteContact(id);
            toastSuccess('Contact Deleted');
            navigate('/contacts');
            getAllContacts();
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };


    const selectImage = () => {
        inputRef.current.click();
    };

    const udpatePhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);
            setContact((prev) => ({...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`}));
            toastSuccess('Photo updated');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const onChange = (event) => {
        setContact({...contact, [event.target.name]: event.target.value});
    };

    const onUpdateContact = async (event) => {
        event.preventDefault();
        await updateContact(contact);
        await fetchContact(id);
        toastSuccess('Contact Updated');
        navigate('/contacts')
        getAllContacts();
    };

    useEffect(() => {
        fetchContact(id);
    }, []);

    return (
        <>
            <Link to={'/contacts'} className='link'><i className='bi bi-arrow-left'></i> Back to list</Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={contact.photoUrl} alt={`Profile photo of ${contact.name}`}/>
                    <div className='profile__metadata'>
                        <p className='profile__name'>{contact.name}</p>
                        <p className='profile__muted'>JPG or PNG. Max size of 10 MB</p>
                        <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Change
                            Photo
                        </button>
                    </div>
                </div>
                <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateContact} className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={contact.id} name="id" required/>
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={contact.name} onChange={onChange} name="name" required
                                           pattern="[A-Z][a-z]*\s[A-Z][a-z]*"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="email" value={contact.email} onChange={onChange} name="email" required
                                           pattern="\S+@\S+\.\S+"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone</span>
                                    <input type="tel" value={contact.phone} onChange={onChange} name="phone" required
                                           pattern="[0-9]{9}"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Address</span>
                                    <input type="text" value={contact.address} onChange={onChange} name="address"
                                           required/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Title</span>
                                    <input type="text" value={contact.title} onChange={onChange} name="title" required/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Status</span>
                                    <select value={contact.status} onChange={onChange} name="status" required>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form_footer">
                                <button onClick={onDeleteContact} className="btn btn-danger">Delete</button>
                                <button type="submit" className="btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <form style={{display: 'none'}}>
                <input type='file' ref={inputRef} onChange={(event) => udpatePhoto(event.target.files[0])} name='file'
                       accept='image/*'/>
            </form>
        </>
    )
}

export default ContactDetail;