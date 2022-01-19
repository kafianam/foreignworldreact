/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useState, useEffect } from "react"
import { useHistory } from "react-router"
import { reactLocalStorage } from "reactjs-localstorage"
import axiosInstance from "../../helper/axios"
import { useGlobalContext } from "../../reducer/cartContext"

const Profile = () => {

    const [data, setData] = useState({})
    const [errors, setErrors] = useState({})

    const history = useHistory()

    const update = (e) => {
        e.preventDefault()
        if(errors.name || errors.email || errors.phone){
            alert('Please provide valid data !')
        }else {
            axiosInstance.post("/update/profile", data, {
                    headers: {
                        Authorization: `Bearer ${reactLocalStorage.getObject('token').token}`,
                    },
                })
            .then(response => {
                if(response?.data?.success == true) {
                    reactLocalStorage.setObject("token", {
                        token: reactLocalStorage.getObject('token').token,
                        user: response?.data?.data,
                    })
                    setData({
                        name: response?.data?.data?.name,
                        email: response?.data?.data?.email,
                        phone: response?.data?.data?.phone // here we'll add old and new password
                    })
                    alert('Profile updated successfully !')
                }
            })
            .catch(error => {
                if(error?.response?.data?.data) alert(error?.response?.data?.data)
            })
        }
    }

    const validator = (fieldName, value) => {
        setErrors({})
        switch (fieldName) {
            case 'name':
                if(value.length === 0) setErrors({...errors, name: 'Name field is required !'})
                break
            case 'email':
                if(value.length === 0) setErrors({...errors, email: 'Email field is required !'})
                break
            case 'phone':
                if(value.length === 0) setErrors({...errors, phone: 'Phone field is required !'})
                else if(value.length < 11) setErrors({...errors, phone: 'Minimum 11 digit !'})
                break
            default:
                alert('Call validator function correctly !')
                break
        }
    }

    useEffect(() => {
        const user = reactLocalStorage.getObject('token')?.user
        if(!user || !user.phone) history.push('/')
        else setData({
            name: user?.name,
            email: user?.email,
            phone: user?.phone // here we'll add old and new password
        })
    }, [])

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-sm-6 m-auto">
                        <div className="card">
                            <div className="card-header">
                                Update profile
                            </div>
                            <div className="card-body">
                                <form onSubmit={update}>
                                    <input type="text" className="form-control mt-2"
                                        onChange={(e) => {setData({...data, name: e.target.value}); validator('name', e.target.value)} }
                                        defaultValue={data.name} />
                                        { errors.name &&
                                            <small className="text-danger">{errors.name}</small>
                                        }
                                    <input type="text" className="form-control mt-2"
                                        onChange={(e) => {setData({...data, email: e.target.value}); validator('email', e.target.value)}}
                                        defaultValue={data.email} />
                                        { errors.email &&
                                            <small className="text-danger">{errors.email}</small>
                                        }
                                    <input type="text" className="form-control mt-2"
                                        onChange={(e) => {setData({...data, phone: e.target.value}); validator('phone', e.target.value)}}
                                        defaultValue={data.phone} />
                                        { errors.phone &&
                                            <small className="text-danger">{errors.phone}</small>
                                        }
                                    {/* <input type="text" className="form-control mt-2"
                                        onChange={(e) => {setData({...data, old_password: e.target.value}); validator('old_password', e.target.value)}}
                                        placeholder="Old password" />
                                        { errors.old_password &&
                                            <small className="text-danger">{errors.old_password}</small>
                                        }
                                    <input type="text" className="form-control mt-2"
                                        onChange={(e) => {setData({...data, new_password: e.target.value}); validator('new_password', e.target.value)}}
                                        placeholder="New password" />
                                        { errors.new_password &&
                                            <small className="text-danger">{errors.new_password}</small>
                                        } */}
                                    <button className="btn btn-success mt-2">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Profile