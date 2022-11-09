import axios from 'axios';
import React, { useState } from 'react'
import Header from '../Header'
import { SpinnerRoundFilled } from 'spinners-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';




function NewPost() {

    const altPic = "https://res.cloudinary.com/dhejdjq9l/image/upload/v1656278153/Group_2_1_spt4rf.png"
    const { register, handleSubmit } = useForm();
    const [secureUrl, setSecureUrl] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const id = window.localStorage.getItem('id')

    // const categories = ['Sports', 'Health', 'Lifestyle', 'Business', 'Healthy Living', 'Entertainment', 'Politics', 'Article', 'Travel', 'Food', 'News Update']

    const onSubmit = (data) => {
        setLoading(true)
        secureUrl === '' ? data.thumbnail = altPic : data.thumbnail = secureUrl
        data.date = new Date().toLocaleDateString()
        data.posterImage = altPic;
        data.posterId = id;
        console.log(data)
        axios.post('https://vast-ruby-cheetah-cape.cyclic.app/api/post/create/news', data).then((res) => {
            console.log(res.data)
            setLoading(false)
            window.alert('Post created successfully');
            navigate(`/${id}`)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
            setError('Could not create Post')
        })
        
    }


    const uploadImage = (file) => {
        setDisabled(true)
        setLoading(true)
        const data = new FormData();
        data.append('file', file[0])
        data.append('upload_preset', 't04ny6oh')
        axios.post('https://api.cloudinary.com/v1_1/dhejdjq9l/image/upload', data).then((res) => {
            console.log(res.data['secure_url'])
            setSecureUrl(res.data['secure_url'])
            setDisabled(false)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
            setDisabled(false)
            setError('Somethin went wrong. Could not upload image')
        })
    }


  return (
    <>
        <Header />
        <div className='col-md-8' style={{margin: '2em 0'}}>
            <aside className='wrapper__list__article'>
                <h4 className='border_section'>Upload your own News</h4>
            </aside>
            <div className="card mx-auto" style={{maxWidth:'520px'}}>
                <article className="card-body">
                    <header className="mb-4">
                        <h4 className="card-title">Make a Post</h4>
                    </header>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
                            <div className="col form-group">
                                <label>Title</label>
                                <input {...register('title')} required type="text" className="form-control" placeholder="" />
                            </div> 
                            <div className="col form-group">
                                <label>Author</label>
                                <input {...register('author')} required type="text" className="form-control" placeholder="" />
                            </div> 
                        </div> 
                        <div className="form-group">
                            <label>Category</label>
                            <input {...register('category')} value="General" readOnly type="email" className="form-control" placeholder="" />
                        </div> 
                        <div className="form-group">
                            <label>Thumbnail</label>
                            <input onChange={(e) => uploadImage(e.target.files)} type="file" className="form-control" placeholder="" />
                            <small className="form-text text-muted">Choose your profile in either JPEG, JPG or PNG format</small>
                        </div> 
                        <div className="form-group">
                            <label>News</label>
                            <textarea style={{width: "100%"}} cols="20" rows="10" {...register('news')} placeholder="Enter your News" ></textarea>
                        </div>
                        <div className="form-group">
                            <button disabled={disabled} type="submit" className="btn btn-primary btn-block"> {
                                loading ? <SpinnerRoundFilled color='#ffffff' enabled={loading} /> : 'Upload'
                            } </button>
                            <p style={{color: 'red', textAlign: 'center', paddingTop: '.5em'}}> {error} </p>
                        </div> 
                    </form>
                </article>
            </div>
        </div>
    </>
  )
}

export default NewPost