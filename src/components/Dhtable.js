import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Dhtable() {
    const Navigate = useNavigate()
    const [loading, setloading] = useState(true)
    const [orders, setorders] = useState([])
    let count = 0
    const Dauth = window.localStorage.getItem("Dauth")
    async function didorders() {
        try {
            const { data } = await axios.get("http://localhost:3001/api/bookings/didorders", {
                headers: {
                    "Authorization": `Bearer ${Dauth}`
                }
            });
            setorders(data);
            setloading(false)
        } catch ({ response: { data, status } }) {
            if (status == "403" || status == "401") {
                window.localStorage.clear();
                Navigate("/dlogin", { replace: true })
            }
            else {
                alert(data.error)
            }
        }
    }
    async function Ocomplete(Order) {
        try {
            setloading(true)
            const { data } = await axios.put(`http://localhost:3001/api/bookings/cupdate/${Order._id}`, Order, {
                headers: {
                    "Authorization": `Bearer ${Dauth}`
                }
            });
            didorders()
            setloading(false)
        } catch ({ response: { data, status } }) {
            if (status == "403" || status == "401") {
                window.localStorage.clear();
                Navigate("/dlogin", { replace: true })
            }
            else {
                alert(data.error)
            }
        }
    }
    useEffect(() => {
        didorders();
    }, []);
    return (
        <>
            <div className="container-fulid">
                <div className="card">
                    <div className="card-body">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.no</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Phone Number</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => {
                                    return (
                                        <tr key={o._id}>
                                            <td>{++count}</td>
                                            <td>{o.date}</td>
                                            <td>{o.time}</td>
                                            <td>{o.from}</td>
                                            <td>{o.to}</td>
                                            <td>{o.pnumber}</td>
                                            {o.status === "Accepted" ?
                                                <td><button onClick={() => {
                                                    Ocomplete(o)
                                                }} className="btn btn-outline-primary">Complete</button></td>
                                                : <td>{o.status}</td>
                                            }
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {loading &&
                            <div className="d-flex justify-content-center">
                                <img src="./images/loading.gif" />
                            </div>
                        }
                    </div>
                </div>
            </div>
            <br />
        </>
    );
}

export default Dhtable;