import img3 from '../img/test.png'
import img3c from '../img/test_c.png'
import { TIMELIMIT, TOTALQUEST, PERCENTCORRECT } from '../config/config';

const About = () => {

    function colourImg(event) {
        event.target.src = img3c;

    }

    function greyImg(event) {
        event.target.src = img3;
    }

    return (
        <>
            <div className="container px-5 pt-3">
                <div className="row gx-5 mb-3">
                    <div className="col">
                        <div className="p-3 px-4 border bg-light">
                            <div>PPL test is the examination test for private pilots licenses, which is based on European
                                   regulations and standards and is also ICAO-compliant.<br />
                                   PPL test has two modes: test for <strong>aircraft</strong> licenses and test for <strong>helicopter</strong> licenses.<br />
                                   PPL test database contain:
                                   <div className="row gx-5 mb-0">
                                    <div className="col">
                                        <ul className="mb-0">
                                            <li>Air Law - 97 questions</li>
                                            <li>Human Performance and Limitations - 58 questions</li>
                                            <li>Meteorology - 129 questions</li>
                                            <li>Communication - 87 questions</li>
                                            <li>Principles of Flight - 102 questions</li>
                                            <li>Operational Procedures - 61 questions</li>
                                            <li>Flight Performance and Planning - 101 questions</li>
                                            <li>Aircraft General Knowledge - 128 questions</li>
                                            <li>Navigation - 137 questions</li>
                                        </ul>
                                    </div>
                                    <div className="col tc">
                                        <img src={img3} height="180px" alt=''
                                            onMouseEnter={colourImg} onMouseLeave={greyImg} />
                                    </div>
                                </div>
                                   PPL test asks to answer <strong>{TOTALQUEST} random questions</strong> from all of the topics above.<br />
                                   To pass the test, user must answer correctly at least <strong>{PERCENTCORRECT}%</strong> of the questions and meet the deadline in <strong>{TIMELIMIT} minutes</strong>.
                               </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About;