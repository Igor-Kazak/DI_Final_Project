
const WrongAnswers = (props) => {

    const { data } = props;

    if (data.length !== 0) {
        return (
            <>
                <div className="container px-5 pt-3">
                    <div className="row gx-5 mb-3">
                        <div className="col">
                            <div className="p-3 px-4 border bg-light">
                                {data.map((item, i) => {
                                    return (
                                        <div className="p-3 border mt-2 mb-3" key={i}>
                                            <span>{item?.question}</span><br />
                                            <span style={{ color: "red" }}>{item?.userAnswer}</span><br />
                                            <span style={{ color: "green" }}>{item?.correctAnswer}</span>
                                        </div>)
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <>
            </>
        )
    }
}

export default WrongAnswers;
