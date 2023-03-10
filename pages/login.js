import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Cookie from "js-cookie"
import Router, { withRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AddNofi from '../components/nofication';


export default function Login() {

    const [error,setError] = useState('')
    const [nof,setnof] = useState(false)
    const [inputValues,setInputValues] =useState({})
    // let env = 'http://localhost:5001/'
       let env = 'https://enkhjinsback.vercel.app/'

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    let LoginData = {
        mail: '',
        password: ''
    }

    function saveUserdata(e) {
        LoginData[e.target.name] = e.target.value
        console.log(LoginData)
         setnof(false)
    }

    function handleChange(evt) {
        setnof(false)
        const value = evt.target.value;
        setInputValues({
    ...inputValues,
    [evt.target.name]: value
    })
    }

    function Login(event) {
        event.preventDefault();
        let datas ;
        if (inputValues.mail != ''&&inputValues.password != ''){
            axios.post(env+'login', inputValues,
            { headers }
        )
            .then((res) => {
                datas = res.data
               console.log(res.data)
                if( datas != "uns"){

                    Cookie.set("Token", res.data, {
                                    expires: 1 / 60
                                })
                                Router.push({
                                    pathname:'/dashboard',
                                    query: { keys: res.data} }
                                  )
                    
                } else if (datas == "uns") {
               
                    setError("Нууц үг буруу байна")
                    setnof(true)
                    
                }
            }).catch(() => {
     
                setError("Сервер алдаа гарлаа")
                setnof(true)
            })
        } else {

            setError("Заавал бөглөх талбар бөглнө үү")
            setnof(true)
       
        }
    
        
            
    }
    return (


        <div className={styles.logincontainer}>

            <Head>
                <title>Нэвтрэх - GFinance</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <div className={styles.span1}>
                Нэвтрэх
            </div>
            <span className={styles.aaa}>
                Хувийн санхүү-д тавтай морилно уу
            </span>

            <div >
                <form className={styles.forms } onSubmit={Login}>
                <input type="text"  value={inputValues['mail']}   onChange={handleChange}  name="mail" placeholder='Нэвтрэх нэр' />

                    <input type="password"  value={inputValues['password']}   onChange={handleChange} name="password" placeholder='Нууц үг' />
                    <button className={styles.buttons} onClick={Login}>
                Нэвтрэх
                </button>   
                </form>
                
            </div>
           

            <div className={styles.register}> <ul>Гишүүн биш ? </ul> <Link href='/register' > Бүртгүүлэх  </Link></div>
            {nof&&<AddNofi error={error} />}
        </div>


    )
}
