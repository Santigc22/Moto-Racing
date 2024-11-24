import React from 'react'


function Carreras() {

    const CardRacing = () => {
        return (
            <div className="card mb-3 m-5" style={{ maxWidth: "100%" }}>
                <div className="row">
                    <div className='col p-3'>
                        <h2>28</h2>
                        <span>Nov</span>
                    </div>
                    <div className='col-5 p-4'>
                        <h2>Pereira Vitrix Grand Prix</h2>
                    </div>
                    <div className='col '>
                        <img
                            style={{width:200}}
                            src="https://th.bing.com/th/id/OIP.k0lSAf7Yw6PYVAwZ9MbILwHaEU?rs=1&pid=ImgDetMain"
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='bg-danger p-5' >
                <div>
                    <h1>Calendario de carreras</h1>
                </div>
            </div>
            <div className='container' >
                <ul>
                    <CardRacing />
                </ul>
                <ul>
                    <CardRacing />
                </ul>
                <ul>
                    <CardRacing />
                </ul>
            </div>
        </div>
    )
}



export default Carreras