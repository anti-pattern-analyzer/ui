import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '@/helpers/firebase';

const NewPostModal = ({ onClose, newPost, setNewPost, onSubmit }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Add state to track upload progress

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        setIsUploading(true);
    
        // Resize image
        const resizedImage = await resizeImage(file);
    
        const storage = getStorage(app);
        const storageRef = ref(storage, `posts/${file.name}_${new Date().toISOString()}`);
        const uploadTask = uploadBytesResumable(storageRef, resizedImage);
    
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress); // Update progress state
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                console.error(error);
                setIsUploading(false);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setNewPost(prevState => ({
                        ...prevState,
                        photo_url: downloadURL
                    }));
                    setIsUploading(false);
                    setUploadProgress(0); // Reset progress
                });
            }
        );
    };
    
    // Function to resize image
    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Set maximum width for resized image
                    const MAX_HEIGHT = 800; // Set maximum height for resized image
                    let width = img.width;
                    let height = img.height;
    
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
    
                    canvas.width = width;
                    canvas.height = height;
    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
    
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, file.type);
                };
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };    

    const handlePost = () => {
        if (!isUploading) {
            onSubmit(newPost);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full flex justify-center items-center transition-opacity duration-300" id="my-modal">
            <div className="relative mx-auto p-8 border w-full max-w-lg shadow-lg rounded-lg bg-white transition-transform transform duration-300 ease-out" style={{ translateY: 'scale(0.95)' }}>
                <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add New Skywatching Diary</h3>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        required
                        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-blue-700 hover:file:bg-gray-100"
                    />
                    <textarea
                        name="caption"
                        value={newPost.caption}
                        onChange={handleInputChange}
                        placeholder="Caption"
                        required
                        className="mb-4 w-full p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                    {isUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%`, transition: 'width 0.5s ease' }}></div>
                        </div>
                    )}
                    <div className="flex justify-end items-center space-x-4">
                        <button onClick={onClose} type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none">
                            Close
                        </button>
                        <button 
                            onClick={handlePost} 
                            disabled={isUploading}
                            className={`px-6 py-2 text-white font-medium rounded-lg ${isUploading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-700'} focus:outline-none disabled:opacity-75`}
                        >
                            {isUploading ? 'Uploading...' : 'Here we goo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPostModal;
