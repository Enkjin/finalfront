import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home1.module.css'
import Router, { withRouter } from 'next/router'
import { User, Dropdown, Button, Table, Modal, Text, Row, Input, useAsyncList } from "@nextui-org/react";
import Cookie from "js-cookie"
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { Doughnut, Line, Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import Loading from '../components/loading.js';

export default function widthDraw() {

    // DATA 
    const [visible1, setVisible1] = useState(false);
    let option_id1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const year = ["2019","2020","2021","2022"]
    // let env = 'http://localhost:5001/'
    let env = 'https://enkhjinsback.vercel.app/'
    const [loadingschck,setLoadingCheck] = useState(true)
    const [visible, setVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [inputValues, setInputValues] = useState({})
    const [sendbutton, setSendbutton] = useState(false)
    const [error, setError] = useState("")
    const [errors, setErrors] = useState(false)
    const [monthloop, setloop] = useState(option_id1)
    const [dataAv, setdataAv] = useState(false)
    const [userData, setUserdata] = useState()
    const [sD, setSd] = useState('2021')
    const [eD, setEd] = useState('2022')
    const [Doughnutdata, setDouData] = useState({})
    const [Lines, setLines] = useState({})
    const [radars, setRadars] = useState({})
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const a = Cookie.get("Token")
    let option_id = [0, 1, 2, 3, 4, 5, 6, 7]
    let options = [
        { value: 'Choose type' },
        { value: 'Household use' },
        { value: 'Community' },
        { value: 'Recreation' },
        { value: 'Health' },
        { value: 'Education' },
        { value: 'Food' },
        { value: 'Others' },

    ]

    const options_line = {
        // responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: '2022 оны зарлага',
            },
        },
    };

    const options_d={
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }




    //FUNCTIONS

    const handler1 = () => setVisible1(true);
    const closeHandler1 = () => {
        setVisible1(false);
    };

    const getdata = () => {
setLoadingCheck(true)
        axios.get(env + 'withdrawdata?userid=' + a)
            .then((res) => {
                if (res.data != "nondata") {
                    setUserdata(res.data)
                    console.log(userData)
                    setLines(linchartdevider(res.data))
                    setDouData(division(res.data))
                    setRadars(division1(res.data,sD,eD))
                    setdataAv(true)

                } else {
                    setdataAv(false)
                }
                setLoadingCheck(false)
            }).catch((err) => {
                console.log(err)
                setdataAv(false)
                setLoadingCheck(false)
            })

    }

    useEffect(() => {
        getdata()
        // console.log(s)
        // setDouData(division(s))

    }, [eD,sD])
    const closeHandler = () => {
        setVisible(false);
    };
    const handler = () => setVisible(true);


    function handleChange(evt) {
        const value = evt.target.value;
        console.log(inputValues)
        setInputValues({
            ...inputValues,
            [evt.target.name]: value

        })
    }

    const savedatas = () => {
        let datetime = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
        let params = {
            type: inputValues.options,
            income: inputValues.incomeval,
            date: datetime,
            userid: a
        }
        console.log(params)
        axios.post(env + 'addwithdraw', params, { headers })
            .then((res) => {
                setVisible(false);
                setErrors(false)
                getdata()

            }).catch((err) => {
                setError("Сервер алдаа гарлаа")
                setErrors(true)
            })

    }

    function linchartdevider(item) {

        let Util = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
        let Community = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
        let Holiday = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
        let Health = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
        let Education = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
        let Food = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
        let Others = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }

        item.map((item) => {
            let year =  item.date.split('-')[0]
            if( year == "2022")
            {let month = item.date.split('-')[1]

            if (item.category == "Household use") {
                Util[month] = Util[month] + item.sale
            } else if (item.category == "Community") {
                Community[month] = Community[month] + item.sale
            } else if (item.category == "Recreation") {
                Holiday[month] = Holiday[month] + item.sale
            } else if (item.category == "Health") {
                Health[month] = Health[month] + item.sale
            } else if (item.category == "Education") {
                Education[month] = Education[month] + item.sale
            } else if (item.category == "Food") {
                Food[month] = Food[month] + item.sale
            } else if (item.category == "Others") {
                Others[month] = Others[month] + item.sale
            }}
        })

        let a = ["Util", "Community", "Holiday", "Health", "Education", "Food", "Others"]
        let aa = [Util, Community, Holiday, Health, Education, Food, Others]
        let b = []
        const colors = [
            'rgba(255, 99, 132,  1)',
            'rgba(54, 162, 235,  1)',
            'rgba(255, 206, 86,  1)',
            'rgba(75, 192, 192,  1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64,  1)',
        ];
        const colors1 = [
            'rgba(255, 99, 132,  1)',
            'rgba(54, 162, 235,  1)',
            'rgba(255, 206, 86,  1)',
            'rgba(75, 192, 192,  1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64,  1)',
        ];



        a.map((item, indexs) => {

            b.push({
                label: item,
                // borderWidth: 2,
                // pointRadius: 1,
                data: Object.values(aa[indexs]),
                borderColor: colors[indexs],
                backgroundColor: colors1[indexs],
                
            })
        })

        return {
            labels: monthloop,
            datasets: b
        }



    }

    function division(item) {

        let aa = 0, bb = 0, cc = 0, dd = 0, ee = 0, ff = 0, gg = 0

        let a = ["Util", "Community", "Holiday", "Health", "Education", "Food", "Others"]

        item.map((e) => {
            let year =  e.date.split('-')[0]
            if (year == "2022"){
                if (e.category == "Household use") {
                    aa = aa + e.sale
                } else if (e.category == "Community") {
                    bb = bb + e.sale
                } else if (e.category == "Recreation") {
                    cc = cc + e.sale
                } else if (e.category == "Health") {
                    dd = dd + e.sale
                } else if (e.category == "Education") {
                    ee = ee + e.sale
                } else if (e.category == "Food") {
                    ff = ff + e.sale
                } else if (e.category == "Others") {
                    gg = gg + e.sale
                }
            }
            
        })
        console.log([aa, bb, cc, dd, ee, ff, gg])
        let datassss = {
            labels: a,
            datasets: [{
                data: [aa, bb, cc, dd, ee, ff, gg],
                backgroundColor: [
                    'rgba(255, 99, 132  ,0.5)',
                    'rgba(54, 162, 235  ,0.5)',
                    'rgba(255, 206, 86  ,0.5)',
                    'rgba(75, 192, 192  ,0.5)',
                    'rgba(153, 102, 255 ,0.5)',
                    'rgba(255, 159, 64  ,0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132,  1)',
                    'rgba(54, 162, 235,  1)',
                    'rgba(255, 206, 86,  1)',
                    'rgba(75, 192, 192,  1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64,  1)',
                ],
                borderWidth: 1,
            }]
        };
        return datassss
    }

    function division1(item,sdat,edat) {
        let a = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
        let b = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }
      
 
        item.map((e) => {
            let year =  e.date.split('-')[0]
            let month = e.date.split('-')[1]
            if (year == sdat) {
                a[month] = a[month] + e.sale 

            } else if (year == edat) {
                b[month] = b[month] + e.sale 
            }
        })
   
        let datassss = {
            labels: Object.keys(a),
            datasets: [
                {
                    fill: true,
                    label: sdat + '  year',
                    data: Object.values(a),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  },
                  {
                    fill: true,
                    label: edat + ' year',
                    data: Object.values(b),
                    borderColor:  'rgba(255, 99, 132,  1)',
                    backgroundColor: 'rgba(255, 99, 132,  0.5)',
                  },
            ]
        };
        return datassss
    }

    function handleChange1(evt) {

        const value = evt.target.value;
        setSd(value)

    }

    function handleChange2(evt) {

        const value = evt.target.value;
        setEd(value)

    }





    return (
        <div className={styles.container}>


            <main className={styles.main1}>

                <div className={styles.dashboardCon}>
                    <div className={styles.addN}>

                        <div className={styles.addNbarimt}>
                            <div className={styles.fuckkk}>
                            <Button onClick={handler} auto color="secondary" rounded flat css={{ fontFamily: "$sans", fontWeight: "500" }}
                            >Add withdraw</Button><Button onPress={handler1} auto color="error" rounded flat>Check withdraw statistic</Button></div>
                            <div className={styles.addNbarimttext}>
                                <div className={styles.description}>
                                    <span css={{}}>Tips</span>
                                    <ul>
                                        <li> Add withdraw</li>
                                        <li> Must have date</li>
                                        <li> Insert type</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles.tablecon}>
                            {dataAv && <Table

                                fixed={true}
                                color="primary"
                                aria-label="Example table with static content"
                                css={{
                                    height: "auto",
                                    minWidth: "100%",

                                }}
                                shadow={false}
                            >
                                <Table.Header >
                                    <Table.Column allowsSorting key="date">Date</Table.Column>
                                    <Table.Column key="category">Type</Table.Column>
                                    <Table.Column allowsSorting key="sale">Amount</Table.Column>
                                </Table.Header>
                                <Table.Body items={userData}
                                >
                                    {(item) => (
                                        <Table.Row key={item._id}>
                                            {(columnKey) => {

                                                if (columnKey == "category" || columnKey == "sale" || columnKey == "date") {
                                                    return (<Table.Cell css={{ color: "black", fontSize: "$sm" }}>
                                                        {item[columnKey]}
                                                    </Table.Cell>)
                                                }


                                            }}
                                        </Table.Row>
                                    )}

                                </Table.Body>
                                <Table.Pagination
                                    size="xs"
                                    noMargin
                                    // align="center"
                                    rowsPerPage={6}
                                    onPageChange={(page) => console.log({ page })}
                                />
                            </Table>}


                        </div>

                    </div>
                    {/* <div className={styles.dashboardN1}>
                        {loadingschck&&<div css={{display:"flex","justify-content":"center"}}><Loading/></div>}
                       { !loadingschck&&dataAv&&<div className={styles.columnsS}>
                        <Row>2022 оны зарлага сар бүрээр</Row>
                            <div className={styles.columnsS1}>
                            
                            <br /> <br />
                            {dataAv && <Line options={options_line} height={850} width={1100}
                                data={Lines} />}
                            </div>
                           
                        </div>}
                       { !loadingschck&&dataAv&&<div className={styles.columnsw}>
                        <Row>2022 оны зарлага нийт</Row>
                            <div className={styles.wrow1}> 
                            
                            <br /> <br /><br />
                                {dataAv && <Doughnut options={options_d} data={Doughnutdata}  />}
                            </div>
                            <br /> <br /><br />
                          <div className={styles.wrow}>
                          <Row>< select name="hall" id="hall" onChange={handleChange1} value={sD} defaultValue={10}>
                                    {year.map((e) => {
                                        return (<option value={e}>{e}</option>)
                                    })
                                    }
                                </select> &nbsp; он &nbsp; 
                                    <select name="hall" id="hall1" onChange={handleChange2} value={eD} defaultValue={11}>
                                        {year.map((e) => {
                                            return (<option value={e}>{e}</option>)
                                        })
                                        }
                                    </select> &nbsp; он харьцуулалт  /Мян/</Row>
                                    {dataAv && <Line  data={radars}  height={200}/>}
                          
                          </div>
                        </div>}
                        {!dataAv&&!loadingschck &&<div>Үр дүн олдсонгүй</div>}
                    </div> */}
                </div>


                <Modal
                    closeButton
                    aria-labelledby="modal-title"
                    open={visible}
                    onClose={closeHandler}

                >
                    <Modal.Header>
                        <Text id="modal-title" size={18}>

                            <Text b size={18}>
                                Add withdraw
                            </Text>
                        </Text>
                    </Modal.Header>
                    <Modal.Body>

                        {errors && <Row>{error}</Row>}

                        <form className={styles.depositIncome} onSubmit={savedatas} >
                            <select required name='options' onChange={handleChange} value={inputValues['options']} id="type">
                                {option_id.map(id =>
                                    <option key={id} value={options[id].value}>{options[id].value}</option>
                                )}
                            </select>

                            <Input
                                value={inputValues['incomeval']}
                                onChange={handleChange}
                                name="incomeval"
                                required
                                bordered
                                type="number"
                                color="primary"
                                css={{ height: "45px", width: "170px" }}
                                placeholder="Amount"

                            />
                            <Row css={{ marginTop: "20px" }}>
                                <DatePicker

                                    wrapperClassName={styles.datePicker}
                                    value={startDate} selected={startDate}
                                    portalId="root-portal"
                                    onChange={(date) => setStartDate(date)}
                                    withPortal
                                />

                            </Row>






                        </form>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto flat color="error" onPress={closeHandler} >
                            Exit
                        </Button>
                        <Button auto onPress={savedatas}  >
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    closeButton
                    aria-labelledby="modal-title"
                    open={visible1}
                    width={900}

                    onClose={closeHandler1}>
                    <Modal.Body >

                          <div className={styles.dashboardN1}>
                        {loadingschck&&<div css={{display:"flex","justify-content":"center"}}><Loading/></div>}
                       
                       
                       { !loadingschck&&dataAv&&<div className={styles.columnsS}>
                        <Row>Every month in 2022</Row>
                            <div className={styles.columnsS1}>
                            
                            <br /> 
                            {dataAv && <Line options={options_line} height={500} width={600}
                                data={Lines} />}

                            </div>
                           

                        </div>}

                       { !loadingschck&&dataAv&&<div className={styles.columnsw}>
                        {/* <Row>2022 оны зарлага нийт</Row>
                            <div className={styles.wrow1}> 
                            
                            <br /> <br /><br />
                                {dataAv && <Doughnut options={options_d} data={Doughnutdata}  />}
                            </div>
                            <br /> <br /><br /> */}
                          <div className={styles.wrow}>

                          <Row>< select name="hall" id="hall" onChange={handleChange1} value={sD} defaultValue={10}>
                                    {year.map((e) => {
                                        return (<option value={e}>{e}</option>)
                                    })

                                    }


                                </select> &nbsp; year &nbsp; 

                                    <select name="hall" id="hall1" onChange={handleChange2} value={eD} defaultValue={11}>
                                        {year.map((e) => {
                                            return (<option value={e}>{e}</option>)
                                        })

                                        }

                                    </select> &nbsp;  Compare year  /₮/</Row>
                                   

                                    {dataAv && <Line  data={radars}  height={300}/>}

                          
                          </div>
                        </div>}

                        {!dataAv&&!loadingschck &&<div>Үр дүн олдсонгүй</div>}
                    </div>



                    </Modal.Body>

                </Modal>

            </main>


        </div>
    )
}
