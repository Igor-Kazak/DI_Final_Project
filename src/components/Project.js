import img1 from '../img/node.png'
import img2 from '../img/react.png'
import img1c from '../img/node_c.png'
import img2c from '../img/react_c.png'

const Project = () => {

    function colourImg(event) {
        if (event.target.id === "1") {
            event.target.src = img1c;
        }
        else {
            event.target.src = img2c;
        }
    }

    function greyImg(event) {
        if (event.target.id === "1") {
            event.target.src = img1;
        }
        else {
            event.target.src = img2;
        }
    }

    return (
        <>
            <div className="container px-5 pt-3">
                <div className="row gx-5 mb-3">
                    <div className="col">
                        <div className="p-3 px-4 border bg-light">
                            <p>PPL test is the <strong>Final project</strong> made during Full Stack Coding Bootcamp
                            in <a href="https://developers.institute/en/" target="_blanc"
                            style={{textDecoration:"none"}}>Developers Institute</a>.<br />
                            PPL test consists of two parts: <strong>back-end</strong> and <strong>front-end</strong>.</p>
                            <div className="row gx-5 mb-3">
                                <div className="col">
                                    Back-end part based on:
                            <ul className="mb-0">
                                        <li>Node.js</li>
                                        <li>Express</li>
                                        <li>Knex</li>
                                        <li>PostgreSQL</li>
                                    </ul>
                                </div>
                                <div className="col ">
                                    <img src={img1} height="100px" alt='' id="1"
                                        onMouseEnter={colourImg} onMouseLeave={greyImg} />
                                </div>
                            </div>
                            <div className="row gx-5 mb-3">
                                <div className="col">
                                    Front-end part based on:
                            <ul className="mb-0">
                                        <li>React</li>
                                        <li>Redux</li>
                                        <li>HTML</li>
                                        <li>CSS</li>
                                    </ul>
                                </div>
                                <div className="col">
                                    <img src={img2} height="100px" alt='' id="2"
                                        onMouseEnter={colourImg} onMouseLeave={greyImg} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Project;