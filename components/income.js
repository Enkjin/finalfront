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
import Loadings from '../components/loading.js'
// import { type } from '@amcharts/amcharts5';

// export async function getServerSideProps(context) {
//   const res = await Cookie.get("Token")

//   console.log(res)
//     return {
//       props: {id:res}, // will be passed to the page component as props
//     }



// }
export default function Home() {


    let option_id1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    // let env = 'http://localhost:5001/'
    let env = 'https://enkhjinsback.vercel.app/'
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const handler = () => setVisible(true);
    const [startDate, setStartDate] = useState(new Date());
    const [inputValues, setInputValues] = useState({})
    const [sendbutton, setSendbutton] = useState(false)
    const [error, setError] = useState("")
    const [errors, setErrors] = useState(false)
    const [monthloop, setloop] = useState(option_id1)
    const [sD, setSd] = useState('10')
    const [eD, setEd] = useState('11')
    const [loadingschck, setLoadingCheck] = useState(true)

    const [Doughnutdata, setDouData] = useState({})
    const [Lines, setLines] = useState({})
    const [radars, setRadars] = useState({})
    // const [Dou,setDuo] = useState({})

    const a = Cookie.get("Token")
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const [userData, setUserdata] = useState()
    const [dataAv, setdataAv] = useState(false)


    function handleChange1(evt) {

        const value = evt.target.value;
        setSd(value)

    }

    function handleChange2(evt) {

        const value = evt.target.value;
        setEd(value)

    }
    const getdata = () => {
        setLoadingCheck(true)
        axios.get(env + 'incomedata?userid=' + a)
            .then((res) => {
                if (res.data != "nondata") {
                    setUserdata(res.data)
                    console.log(userData)
                    setDouData(division(res.data))
                    setLines(devisionbymont(res.data))
                    setRadars(radar(res.data, sD, eD))
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

    }, [sD, eD])



    function division(item) {

        let nemelt = 0, business = 0, job = 0


        item.map((e) => {
            if (e.category == "Income") {
                job = job + e.sale
            } else if (e.category == "Business") {
                business = business + e.sale
            } else if (e.category == "Others") {
                nemelt = nemelt + e.sale
            }
        })
        console.log([job, business, nemelt])
        let datassss = {
            labels: [
                'Income',
                'Business',
                'Others'
            ],
            datasets: [{
                data: [job, business, nemelt],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        };
        return datassss
    }

    function devisionbymont(item) {

        let a = 0, b = 0,
            c = 0, d = 0,
            e = 0, f = 0,
            g = 0, h = 0,
            i = 0, j = 0,
            k = 0, l = 0,
            m = 0
        let kss = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, }

        item.map((e) => {
            let month = e.date.split('-')[1]
            kss[month] = kss[month] + e.sale

        })

        let datss = Object.values(kss)
        console.log(datss)


        return {
            labels: ['1', ' 2 ', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            datasets: [
                {
                    label: "Income in a month",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: datss
                }
            ]
        };
    }

    const optionsssss = {
        scales: {
            r: {

                grid: {
                    color: "lightgreen",
                },

            },


        }
    }

    function radar(item, s, enddate) {
        let data1, data2
        let a = { "Income": 0, "Business": 0, "Others": 0 }
        let b = { "Income": 0, "Business": 0, "Others": 0 }
        item.map((e) => {
            let month = e.date.split('-')[1]
            if (month == s) {
                a[e.category] = a[e.category] + e.sale / 1000

            } else if (month == enddate) {
                b[e.category] = b[e.category] + e.sale / 1000
            }

        })

        console.log(a)

        return {
            labels: ['Income', 'Business', 'Others'],
            datasets: [
                {
                    label: s + ' month',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: Object.values(a)
                },
                {
                    label: enddate + ' month',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: Object.values(b)
                },

            ],
        }
    }

    function handleChange(evt) {
        const value = evt.target.value;
        console.log(inputValues)
        setInputValues({
            ...inputValues,
            [evt.target.name]: value

        })

        if (inputValues.options == null || inputValues.options == 'Choose type') {
            setSendbutton(false)

        } else if (!(inputValues.incomeval == null || inputValues.incomeval == '')) {
            setSendbutton(true)

        }

        if (inputValues.incomeval == null || inputValues.incomeval == '') {
            setSendbutton(false)
        } else if (!(inputValues.options == null || inputValues.options == 'Choose type')) {
            setSendbutton(true)
        }
    }
    const closeHandler = () => {
        setVisible(false);
    };
    const handler1 = () => setVisible1(true);
    const closeHandler1 = () => {
        setVisible1(false);
    };

    const savedatas = () => {
        let datetime = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
        let params = {
            type: inputValues.options,
            income: inputValues.incomeval,
            date: datetime,
            userid: a
        }
        axios.post(env + 'addincome', params, { headers })
            .then((res) => {
                setVisible(false);
                setErrors(false)
                getdata()

            }).catch((err) => {
                setError("Сервер алдаа гарлаа")
                setErrors(true)
            })

    }

    function routerpush() {
        // Cookie.remove("Token")
        // Router.push({

        //   pathname: '/'
        // })
        console.log("clicked")

    }

    let option_id = [0, 1, 2, 3]

    let options = [
        { value: 'Choose type' },
        { value: 'Income' },
        { value: 'Business' },
        { value: 'Others' }
    ]

    return (
        <div className={styles.container}>


            <main className={styles.main1}>


                {/* <div className={styles.header}>
          <div className={styles.usercontent}></div>
          <div className={styles.usercontent1}> <User bordered
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            name="Namewillbe"
            color='primary'
            css={{ color: "White" }}
            description="@tonyreichert"
          >
          </User>
            <Button onPress={routerpush} css={{ color: "rgb(252, 213, 53)" }} size="xs" light>
              OUT
            </Button>
          </div>
        </div> */}
                <div className={styles.dashboardCon}>
                    <div className={styles.addN}>

                        <div className={styles.addNbarimt}>
                            <div className={styles.fuckkk}
                            ><Button onClick={handler} auto color="secondary" rounded flat css={{ fontFamily: "$sans", fontWeight: "500" }}
                            >Add income </Button><Button onPress={handler1} auto color="error" rounded flat> Check income statistic</Button></div>

                            <div className={styles.addNbarimttext}>
                                <div className={styles.description}>
                                    <span css={{}}>Tips</span>
                                    <ul>
                                        <li> Add income </li>
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


                    {/* <div className={styles.dashboardN}>
                    {loadingschck&&<Loadings/>}
                     { !loadingschck&&dataAv&&  <div className={styles.rows}>
                            <div className={styles.columns}>
                                <Row>НИЙТ ОРЛОГО</Row>
                                {dataAv && <Doughnut
                                    data={Doughnutdata}
                                    width={600}
                                    height={600}
                                />}
                                
                            </div>
                            <div className={styles.columns}>
                                <Row> 2022 он  &nbsp; &nbsp;  <select name="hall" id="hall" onChange={handleChange1} value={sD} defaultValue={10}>
                                    {monthloop.map((e) => {
                                        return (<option value={e}>{e}</option>)
                                    })
                                    }
                                </select> &nbsp; сар &nbsp;
                                    <select name="hall" id="hall1" onChange={handleChange2} value={eD} defaultValue={11}>
                                        {monthloop.map((e) => {
                                            return (<option value={e}>{e}</option>)
                                        })
                                        }
                                    </select> &nbsp; сар харьцуулалт  /Мян/</Row>
                                {dataAv && <Radar
                                    data={radars}
                                    options={optionsssss}
                                    color='lightGreen'
                                    width={500}
                                    height={500}
                                />}
                            
                            </div>
                        </div>}
                        {!loadingschck&&dataAv&& <div className={styles.rows} css={{ marginTop: "20px" }}>
                            <div className={styles.columns}>
                                <Row>2022 оны </Row>
                                {dataAv && <Line
                                    data={Lines}
                                    width={600}
                                    height={400}
                                />}
                              
                            </div>
                            <div className={styles.columns}></div>
                        </div>}
                                    
                    </div> */}
                </div>


                <Modal
                    closeButton
                    aria-labelledby="modal-title"
                    open={visible}
                    onClose={closeHandler}
                // css={{height:"400px"}}
                >
                    <Modal.Header>
                        <Text id="modal-title" size={18}>

                            <Text b size={18}>
                                Add income
                            </Text>
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        {errors && <Row>{error}</Row>}
                        <form className={styles.depositIncome} onSubmit={savedatas}>
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

                        {/* <DatePicker value={startDate} selected={startDate} views={['year', 'month', 'day']} onChange={(date) => setStartDate(date)} /> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button auto flat color="error" onClick={closeHandler}>
                            Exit
                        </Button>
                        <Button auto disabled={!sendbutton} onClick={savedatas} >
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
                        <div className={styles.dashboardN} css={{display:"flex",'justifyContent':"center"}}>
                            {loadingschck && <Loadings />}
                            {!loadingschck && dataAv && <div className={styles.rows} >
                                <div className={styles.columns}>
                                    <Row>All income</Row>
                                    {dataAv && <Doughnut
                                        data={Doughnutdata}
                                        width={600}
                                        height={600}
                                    />}

                                </div>
                                <div className={styles.columns} >

                                    <Row>2022 </Row>
                                    {dataAv && <Line

                                        data={Lines}
                                        width={600}
                                        height={600}
                                    />}

                                </div>

                            </div>}


                        </div>


                    </Modal.Body>

                </Modal>
            </main>


        </div>
    )
}
